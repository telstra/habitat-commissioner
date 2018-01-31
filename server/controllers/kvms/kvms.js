const express = require('express');
const router = express.Router();

// middlewares
const verifyJWT = require('../../middlewares/verify-jwt');
const validateHostName = require('../../middlewares/validate-host-name');
const validateRepo = require('../../middlewares/validate-repo');
const validateOrg = require('../../middlewares/validate-org');
const validateEnv = require('../../middlewares/validate-env');
const validateBody = require('../../middlewares/validate-body');
const validateEntryExists = require('../../middlewares/validate-entry-exists');

// helpers
const responseHelper = require('../../helpers/response-helper');
const fileHelper = require('../../helpers/file-helper');

// models
const apigee = require('../../models/apigee');
var ApigeeResponse = require('../../models/apigee-response');

// called on every request
router.use('/', verifyJWT, validateOrg, validateEnv, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/environments/${res.locals.env}/keyvaluemaps`;
  res.locals.repoExtension = `/config/env/${res.locals.env}/kvms.json`;
  next();
});

// get list of kvms in an environment
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `KVMs from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list kvm entries in a single kvm in apigee
router.get('/apigee/list/:map_name', async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.map_name}`, res.locals.user);
    responseHelper.handleResponse(res, `Entries for KVM ${req.params.name}`, JSON.parse(data.body).entry);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a single kvm
router.get('/apigee/details/:map_name', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.map_name}`, res.locals.user);
    responseHelper.handleResponse(res, `Details for KVM ${req.params.map_name}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a kvm entry
router.get(`/apigee/details/:map_name/:entry`, validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.map_name}/entries/${req.params.entry}`, res.locals.user);
    responseHelper.handleResponse(res, `Entry ${req.params.entry} for KVM ${req.params.map_name}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get kvms from the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `KVMs from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list kvm entries in a single kvm in the repo
router.get('/repo/list/:map_name', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Entries for KVM ${req.params.map_name} from repo`, data[data.findIndex(x => x.name === req.params.map_name)].entry || null);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of a kvm in the repo
router.get('/repo/details/:map_name', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `KVM ${req.params.map_name} from repo`, data[data.findIndex(x => x.name === req.params.map_name)] || { error: "Not found" });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a single kvm entry from the repo
router.get('/repo/details/:map_name/:entry', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Entry ${req.params.entry} for KVM ${req.params.map_name} from repo`, data[data.findIndex(x => x.name === req.params.map_name)].entry.find(x => x.name === req.params.entry) || { error: "Not found" });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// create kvms in apigee
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished creating KVMs in ${res.locals.org}`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// creates new entries in an existing kvm
router.post('/apigee/:map_name', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    fileData = fileData.find(x => x.name === req.params.map_name);

    if (fileData) {
      await Promise.all(req.body.map(async (el) => {
        var data = fileData.entry.find(x => x.name === el);
        results.push(new ApigeeResponse(
          await apigee.post(`${res.locals.apiEndpoint}/${req.params.map_name}/entries`, res.locals.user, false, data)
        ));
      }));
      responseHelper.handleResponse(res, `Finished adding new entries to KVM ${req.params.map_name}`, results);
    } else {
      responseHelper.handleError(res, `${req.params.map_name} not found in ${res.locals.repoFilePath}!`);
    }
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update an existing kvm - not supported on apigee
// router.put('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
//   try {
//     var fileData = await fileHelper.read(res.locals.repoFilePath);
//     var results = [];

//     await Promise.all(req.body.map(async (el) => {
//       var data = fileData.find(x => x.name === el);
//       results.push(new ApigeeResponse(
//         await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, false, data)
//       ));
//     }));

//     responseHelper.handleResponse(res, `Finished updating KVMs`, results);
//   }
//   catch (e) {
//     responseHelper.handleError(res, e);
//   }
// });

// updates existing entries in a kvm
router.put('/apigee/:map_name', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    fileData = fileData.find(x => x.name === req.params.map_name);

    if (fileData) {
      await Promise.all(req.body.map(async (el) => {
        var data = fileData.entry.find(x => x.name === el);
        results.push(new ApigeeResponse(
          await apigee.post(`${res.locals.apiEndpoint}/${req.params.map_name}/entries/${el}`, res.locals.user, false, data)
        ));
      }));
      responseHelper.handleResponse(res, `Finished updating existing entries to KVM ${req.params.map_name}`, results);
    } else {
      responseHelper.handleError(res, `${req.params.map_name} not found in ${res.locals.repoFilePath}!`);
    }
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a KVM
router.delete('/:map_name', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.map_name}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete KVM ${req.params.map_name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a single KVM entry
router.delete('/:map_name/:entry_name', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.map_name}/entries/${req.params.entry_name}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete entry ${req.params.entry_name} from KVM ${req.params.map_name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;