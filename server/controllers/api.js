const express = require('express');
const router = express.Router();
var path = require('path');
var newman = require('newman');
var multer = require('multer');

// middlewares
const verifyJWT = require('../middlewares/verify-jwt');
const validateHostName = require('../middlewares/validate-host-name');
const validateRepo = require('../middlewares/validate-repo');
const validateEnv = require('../middlewares/validate-env');
const validateOrg = require('../middlewares/validate-org');

// helpers
const responseHelper = require('../helpers/response-helper');
var logger = require('../helpers/logger-helper');
var fileHelper = require('../helpers/file-helper');

// models
var User = require('../models/user');
const apigee = require('../models/apigee');

router.use('/', verifyJWT, (req, res, next) => {
  next();
});

// get all base endpoint names
router.get('/', async (req, res, next) => {
  try {
    var dirs = await fileHelper.readDir(path.resolve(__dirname));
    var results = [];
    dirs.forEach(dir => {
      if (!dir.includes('.js')) {
        results.push(dir);
      }
    });
    responseHelper.handleResponse(res, `All HC base endpoints`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get the envs for each org in the users config
router.get('/envs', validateHostName, async (req, res, next) => {
  try {
    var orgs = res.locals.user.config.orgs;
    if (!orgs) {
      return responseHelper.handleError(res, { message: 'No orgs are defined' });
    }

    var results = [];
    await Promise.all(orgs.map(async (org) => {
      var data = await apigee.get(`${org}/environments`, res.locals.user);
      try {
        results.push({ org: org, envs: JSON.parse(data.body).reverse() });
      } catch (e) { }
    }));

    responseHelper.handleResponse(res, `Org and envs from apigee`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get the environments for a single org
router.get('/env/:org', validateHostName, async (req, res, next) => {
  try {
    var envs = await apigee.get(`/${req.params.org}/environments`, res.locals.user);
    responseHelper.handleResponse(res, `Environments for ${req.params.org}`, envs, res.locals.user);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// run postman tests
router.get('/postman_test/:id', (req, res, next) => {
  var userConfig = res.locals.user.config;

  if (userConfig.proxy.enable) {
    process.env.HTTP_PROXY = `${userConfig.proxy.scheme}://${userConfig.proxy.username}:${userConfig.proxy.password}@${userConfig.proxy.host}:${userConfig.proxy.port}`;
  }

  newman.run({
    collection: require(path.resolve(__dirname, `../resources/users/${res.locals.user.username}/tests/${req.params.id}/collection.json`)),
    environment: require(path.resolve(__dirname, `../resources/users/${res.locals.user.username}/tests/${req.params.id}/environment.json`)),
    reporters: ['cli'],
    color: true,
    sslClientCert: userConfig.ssl.enable ? userConfig.ssl.cert : null,
    sslClientKey: userConfig.ssl.enable ? userConfig.ssl.key : null,
    sslClientPassphrase: userConfig.ssl.enable ? userConfig.ssl.passphrase : null
  }).on('start', (error, args) => {
    logger.verbose('Starting Postman test run');
  }).on('beforeItem', (error, args) => {
    logger.verbose(`Testing ${args ? args.item.name : '...'}`);
  }).on('request', (error, args) => {
    if (args) {
      var body;
      if (args.request.body.mode === 'raw') {
        body = JSON.parse(args.request.body.raw);
      }
      else if (args.request.body.mode === 'urlencoded') {
        body = args.request.body.urlencoded
      }
      logger.result(
        {
          statusMessage: args.response.status || null,
          statusCode: args.response.code || null,
          body: {
            request: {
              url: args.request.url || null,
              method: args.request.method || null,
              body: body
            },
            response: args.response && args.response.stream ? JSON.parse(args.response.stream.toString('utf-8')) : null
          }
        }
      );
    }
  }).on('test', (error, args) => {
    if(args) {
      args.executions.forEach(exec => {
        logger.result(
          {
            statusMessage: exec.result.response.status,
            statusCode: exec.result.response.code,
            body: exec.result.tests
          }
        );
      });
    }
  }).on('exception', (error, args) => {
    logger.error({ message: args ? args.error.message : 'An error occured!', statusCode: 500, data: args.error });
  }).on('done', (err, summary) => {
    if (err) {
      logger.error({ message: 'An error occured!', statusCode: 500, data: err });
      return responseHelper.handleError(res, err);
    }
    logger.verbose('Finshed running Postman tests');
    responseHelper.handleResponse(res, `Finished running Postman tests`, summary);
  });
});

module.exports = router;