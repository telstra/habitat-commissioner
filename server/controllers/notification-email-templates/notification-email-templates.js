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

// logger
var logger = require('../../helpers/logger-helper');

// models
const apigee = require('../../models/apigee');
var ApigeeResponse = require('../../models/apigee-response');

// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/notification-email-templates`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/notification-email-templates.json`;
  next();
});

// get list from apigee
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user, true);
    responseHelper.handleResponse(res, `Notification email templates from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from apigee
router.get('/apigee/details/:id', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.id}`, res.locals.user, true);
    responseHelper.handleResponse(res, `Details for email template ${req.params.id}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get list from the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Notification email templates from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of an item from the repo
router.get('/repo/details/:id', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Details for ${req.params.id} from repo`, data[data.findIndex(x => x.id === req.params.id)] || { error: "Not found" });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// write email templates to the repo. This used to get the conditions as well, but not anymore
router.post('/repo', validateHostName, validateRepo, async (req, res, next) => {
  try {
    var data = [];

    await Promise.all(req.body.map(async (el) => {
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user, true);
      if (!(response.statusCode === 204 || response.statusCode >= 400 && response.statusCode <= 500)) {
        data.push(JSON.parse(response.body));
      }
    }));

    await fileHelper.write(res.locals.repoFilePath, data);
    responseHelper.handleResponse(res, `Finished exporting notification email templates to apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// post templates to apigee
router.post('/apigee', validateHostName, validateRepo, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.id === el);
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, true, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished importing notification email templates to ${res.locals.org}`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a notification email template
router.put('/apigee', validateHostName, validateRepo, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.id === el)
      results.push(new ApigeeResponse(
        await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, true, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished updating notification email templates`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// pretty sure you cant delete email templates
// router.delete('/:id', validateHostName, async (req, res, next) => {
//   try {
//     var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.id}`, res.locals.user, true);
//     responseHelper.handleResponse(res, `Delete ${req.params.id}`, result);
//   }
//   catch (e) {
//     responseHelper.handleError(res, e);
//   }
// });

module.exports = router;