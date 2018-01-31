const express = require('express');
const router = express.Router();

// middlewares
const verifyJWT = require('../../middlewares/verify-jwt');
const validateHostName = require('../../middlewares/validate-host-name');
const validateRepo = require('../../middlewares/validate-repo');
const validateOrg = require('../../middlewares/validate-org');
const validateBody = require('../../middlewares/validate-body');
const validateEntryExists = require('../../middlewares/validate-entry-exists');

// helpers
const responseHelper = require('../../helpers/response-helper');
const fileHelper = require('../../helpers/file-helper');

// models
const apigee = require('../../models/apigee');
var ApigeeResponse = require('../../models/apigee-response');

// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/supported-currencies`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/monetizationCurrencies.json`;
  next();
});


// get list from apigee
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user, true);
    responseHelper.handleResponse(res, `Supported currencies from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from apigee
router.get('/apigee/details/:id', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.id}`, res.locals.user, true);
    responseHelper.handleResponse(res, `Details for supported currency ${req.params.id}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get list from the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Currencies from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from the repo
router.get('/repo/details/:id', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Details for supported currency ${req.params.id} from repo`, data[data.findIndex(x => x.id === req.params.id)] || { error: "Not found" });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// post data to apigee
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.id === el);

      data.organization.description = res.locals.org;
      data.organization.id = res.locals.org;
      data.organization.name = res.locals.org;

      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, true, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished importing currencies to apigee`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// write data from apigee to the repo 
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var data = [];

    await Promise.all(req.body.map(async (el) => {
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user, true);

      // only push successful data
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        data.push(JSON.parse(response.body));
      }
    }));

    await fileHelper.write(res.locals.repoFilePath, data);
    responseHelper.handleResponse(res, `Exported currencies to repo`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a supported currency
router.put('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.id === el);
      results.push(new ApigeeResponse(
        await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, true, data)
      ));
    }));

    responseHelper.handleResponse(res, `Finished updating supported currencies`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete an item
router.delete('/:id', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.id}`, res.locals.user, true);
    responseHelper.handleResponse(res, `Deleted currency ${req.params.id}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;