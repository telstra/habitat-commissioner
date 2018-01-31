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
  res.locals.apiEndpoint = `${res.locals.org}/reports`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/reports.json`;
  next();
});

// get list from apigee
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `Reports from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from apigee
router.get('/apigee/details/:name', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);
    responseHelper.handleResponse(res, `Details for report: ${req.params.name}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get list from the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Reports from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from the repo
router.get('/repo/details/:name', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Report ${req.params.name} from repo`, data[data.findIndex(x => x.name === req.params.name)] || { error: "Not found" });
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

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished importing reports to apigee`, results);
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
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user);
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        data.push(JSON.parse(response.body));
      }
    }));

    await fileHelper.write(res.locals.repoFilePath, data);
    responseHelper.handleResponse(res, `Export reports to repo`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update reports
router.put('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      results.push(new ApigeeResponse(
        await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, false, data)
      ));
    }));

    responseHelper.handleResponse(res, `Finished updating reports in apigee`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete item from apigee
router.delete('/:name', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);
    responseHelper.handleResponse(res, `Deleted report ${req.params.name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;