const express = require('express');
const router = express.Router();
var path = require('path');

// middlewares
const verifyJWT = require('../../middlewares/verify-jwt');
const validateHostName = require('../../middlewares/validate-host-name');
const validateRepo = require('../../middlewares/validate-repo');
const validateOrg = require('../../middlewares/validate-org');
const validateEnv = require('../../middlewares/validate-env');
const validateBody = require('../../middlewares/validate-body');
const validateRevisionBody = require('../../middlewares/validate-revision-body');

// helpers
const responseHelper = require('../../helpers/response-helper');
const fileHelper = require('../../helpers/file-helper');
const xmlHelper = require('../../helpers/xml-helper');

// logger
var logger = require('../../helpers/logger-helper');

// models
const apigee = require('../../models/apigee');
var ApigeeResponse = require('../../models/apigee-response');

// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/apis`;
  res.locals.repoExtension = `/proxies`;
  next();
});

// get list of proxies
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `API proxies from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list of api proxy revisions
router.get('/apigee/list/:name', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions`, res.locals.user);
    responseHelper.handleResponse(res, `Proxy ${req.params.name} revisions`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get api proxy
router.get(`/apigee/details/:name`, validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);
    responseHelper.handleResponse(res, `Details for proxy: ${req.params.name}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get proxy deployments
router.get(`/apigee/deployments/:name`, validateHostName, async(req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Deployments for proxy: ${req.params.name}`, await apigee.getDeployments(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user));
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// get a single proxy revision
router.get('/apigee/details/:name/:revision_number', validateHostName, async (req, res, next) => {
  try {
    // get the proxy revision
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}`, res.locals.user);
    responseHelper.handleResponse(res, `${req.params.name} revision ${req.params.revision_number}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list the proxies in the repo using the config file
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Proxies from repo`, await fileHelper.readDir(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get the config details for a single proxy from the repo
router.get('/repo/details/:name', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `${req.params.name} from repo`, await fileHelper.read(`${res.locals.repoFilePath}/${req.params.name}/config.json`));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// post to apigee
router.post('/apigee', validateHostName, validateRepo, validateEnv, validateBody, async (req, res, next) => {
  try {
    var results = [];

    await Promise.all(req.body.map(async (proxy) => {

      // check the file exists first
      if (await fileHelper.checkExists(`${res.locals.repoFilePath}/${proxy}`)) {

        //get the profile configuration that will define the data we are going to import
        var proxyConfigData = await fileHelper.read(`${res.locals.repoFilePath}/${proxy}/config.json`);
        var proxyConfig = proxyConfigData.configurations.find(configuration => configuration.name === res.locals.env);

        // perform xml transformations
        // proxy
        await Promise.all(proxyConfig.proxies.map(async (prx) => {
          var _path = `${res.locals.repoFilePath}/${proxy}/src/main/apiproxy/proxies/${prx.name}`;
          await xmlHelper.updateProxyInformation(_path, 'ProxyEndpoint', 'HTTPProxyConnection', prx);
        }));

        // target
        await Promise.all(proxyConfig.targets.map(async (tar) => {
          var _path = `${res.locals.repoFilePath}/${proxy}/src/main/apiproxy/targets/${tar.name}`;
          await xmlHelper.updateProxyInformation(_path, 'TargetEndpoint', 'HTTPTargetConnection', tar);
        }));

        // policy
        await Promise.all(proxyConfig.policies.map(async (pol) => {
          var _path = `${res.locals.repoFilePath}/${proxy}/src/main/apiproxy/policies/${pol.name}`;
          await xmlHelper.updateProxyInformation(_path, 'MessageLogging', 'Syslog', pol);
        }));

        await fileHelper.createDir(path.resolve(__dirname, `../../resources/tmp/${res.locals.user.username}`));

        // zip the directory
        var destPath = path.resolve(__dirname, `../../resources/tmp/${res.locals.user.username}/${proxy}@#${Math.floor(Date.now() / 1000)}.zip`);
        await fileHelper.zip(
          `${res.locals.repoFilePath}/${proxy}/src/main`,
          destPath
        );

        // import new proxy revision
        var imported = await apigee.importRevision(
          `${res.locals.apiEndpoint}?action=import&name=${proxy}`,
          destPath,
          res.locals.user
        );

        // delete the zip folder from tmp after importing
        await fileHelper.delete(destPath);

        // undeploy old proxy revision if its in the same enironment we're deploying too
        var deployed = await apigee.getDeployedRevisionInEnvironment(`${res.locals.apiEndpoint}/${proxy}`, res.locals.env, res.locals.user);
        if (deployed) {
          await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/apis/${proxy}/revisions/${deployed.name}/deployments`, res.locals.user);
        }

        // deploy the new revision
        results.push(new ApigeeResponse(
          await apigee.deploy(`${res.locals.org}/environments/${res.locals.env}/apis/${proxy}/revisions/${imported.revision}/deployments`, res.locals.user)
        ));
      } else {
        // didnt find proxy in the repo, so log an error
        logger.error(`${proxy} not found in ${res.locals.repoFilePath}!`);
      }
    }));

    // finished
    responseHelper.handleResponse(res, 'Proxies deployed', results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// export to repo
router.post('/repo', validateHostName, validateRepo, validateEnv, validateRevisionBody, async (req, res, next) => {
  var results = [];

  try {
    await Promise.all(req.body.map(async (el) => {

      // ensure the proxy and revision exist first
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}`, res.locals.user);
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        // export the proxy revision
        await apigee.export(
          `${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}?format=bundle`,
          `${res.locals.repoFilePath}/${el.name}/src/main`,
          res.locals.user
        );

        // after we export and extract the proxy revision we need to generate/ update the dev profile in the config.json file in the repo
        // get the proxy revision
        var data = await apigee.get(`${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}`, res.locals.user);
        data = JSON.parse(data.body);

        // get the config file for the proxy if it exists, else create a new one
        var config;
        var policies = [], proxies = [], targets = [];
        if (await fileHelper.checkExists(`${res.locals.repoFilePath}/${el.name}/config.json`)) {
          config = await fileHelper.read(`${res.locals.repoFilePath}/${el.name}/config.json`)
        } else {
          config = {
            name: el.name,
            configurations: [
              { name: res.locals.env, policies: [], proxies: [], targets: [] }
            ]
          }
        }

        // proxies
        await Promise.all(data.proxies.map(async (proxy) => {
          var proxyData = await apigee.get(`${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}/proxies/${proxy}`, res.locals.user);
          proxyData = JSON.parse(proxyData.body);

          proxies.push({
            name: `${proxy}.xml`,
            tokens: [
              {
                xpath: `/ProxyEndpoint/HTTPProxyConnection/VirtualHost`,
                value: proxyData.connection.virtualHost[0]
              }
            ]
          });
        }));

        // targets
        await Promise.all(data.targets.map(async (target) => {
          var targetData = await apigee.get(`${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}/targets/${target}`, res.locals.user);
          targetData = JSON.parse(targetData.body);

          var tokens = [
            {
              xpath: `/TargetEndpoint/HTTPTargetConnection/URL`,
              value: targetData.connection.uRL
            }
          ];
          if (targetData.connection.sSLInfo) {
            tokens.push(
              {
                xpath: `/TargetEndpoint/HTTPTargetConnection/SSLInfo/KeyStore`,
                value: targetData.connection.sSLInfo.keyStore
              },
              {
                xpath: `/TargetEndpoint/HTTPTargetConnection/SSLInfo/KeyAlias`,
                value: targetData.connection.sSLInfo.keyAlias
              }
            )
          }

          targets.push({
            name: `${target}.xml`,
            tokens: tokens
          });
        }));

        // write the proxy, policy and target data to the config object under the current env then write to the file
        if (!config.configurations.find(x => x.name === res.locals.env)) {
          config.configurations.push({ name: res.locals.env, policies: policies, proxies: proxies, targets: targets });
        } else {
          config.configurations[config.configurations.findIndex(x => x.name === res.locals.env)] =
            { name: res.locals.env, policies: policies, proxies: proxies, targets: targets };
        }

        results.push(await fileHelper.write(`${res.locals.repoFilePath}/${el.name}/config.json`, config));
      }
    }));

    responseHelper.handleResponse(res, `Exported proxies to repo`, results);
  }
  catch (e) {
    return responseHelper.handleError(res, e);
  }
});

// deploy a proxy revision
router.post('/deploy/:name/:revision_number', validateHostName, validateRepo, validateEnv, async (req, res, next) => {
  try {
    // check the proxy and revision exist before we undeploy anything
    var response = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}`, res.locals.user);
    if (response.statusCode >= 400 && response.statusCode <= 500) {
      return responseHelper.handleError(res, response);
    }

    // undeploy old proxy revision if its in the same enironment we're deploying to
    var deployed = await apigee.getDeployedRevisionInEnvironment(`/${res.locals.apiEndpoint}/${req.params.name}`, res.locals.env, res.locals.user);

    if (deployed) {
      await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/apis/${req.params.name}/revisions/${deployed.name}/deployments`, res.locals.user);
    }

    // deploy the new one
    var result = await apigee.deploy(`${res.locals.org}/environments/${res.locals.env}/apis/${req.params.name}/revisions/${req.params.revision_number}/deployments`, res.locals.user);

    responseHelper.handleResponse(res, `Deploy API proxy ${req.params.name} revision ${req.params.revision_number}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

//undeploy a proxy revision
router.delete('/undeploy/:name/:revision_number', validateHostName, validateEnv, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Undeploy API proxy ${req.params.name} revision ${req.params.revision_number}`, await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/apis/${req.params.name}/revisions/${req.params.revision_number}/deployments`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a proxy revision
router.delete('/:name/:revision_number', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Delete API proxy ${req.params.name} revision ${req.params.revision_number}`, await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a proxy
router.delete('/:name', validateHostName, validateEnv, async (req, res, next) => {
  try {
    // find  the deployed revision
    var deployed = await apigee.getDeployedRevisionInEnvironment(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.env, res.locals.user);

    // undeploy it
    if (deployed) {
      await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/apis/${req.params.name}/revisions/${deployed.name}/deployments`, res.locals.user);
    }

    // delete the proxy
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);

    responseHelper.handleResponse(res, `Deleted proxy ${req.params.name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;