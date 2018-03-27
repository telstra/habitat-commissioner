const express = require('express');
const router = express.Router();

// middlewares
const verifyJWT = require('../../middlewares/verify-jwt');
const validateHostName = require('../../middlewares/validate-host-name');
const validateOrg = require('../../middlewares/validate-org');
const validateRepo = require('../../middlewares/validate-repo');
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
  res.locals.apiEndpoint = `${res.locals.org}/developers`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/developers.json`;
  next();
});

// list developers in apigee
router.get(`/apigee/list`, validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `Get developers from apigee`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// details of a developer from apigee. developer can be the developer email or the developerId
router.get('/apigee/details/:developer', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Developer ${req.params.developer} details`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// apps for a developer in apigee. developer can be the developer email or the developerId
router.get(`/apigee/list/:developer`, validateHostName, async(req, res, next) => {
  try {
    var result = await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}/apps`, res.locals.user);
    responseHelper.handleResponse(res, `Apps for delveloper ${req.params.developer}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// details of a developer app in apigee. developer can be the developer email or the developerId
router.get('/apigee/details/:developer/:app', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `App ${req.params.app} details from developer ${req.params.developer}`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}/apps/${req.params.app}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list all developers in the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Developers from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of a developer from the repo. developer must be the developerId
router.get('/repo/details/:developer', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Developer ${req.params.developer} from repo`,
      data[data.findIndex(x => x.developerId === req.params.developer)] || { error: "Not found" }
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get list of developer apps from the repo. developer must be the developerId
router.get('/repo/list/:developer', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath.replace('developers', 'developerApps'));
    responseHelper.handleResponse(res, `Apps for developer ${req.params.developer}`,
      data.reduce((a, e, i) => (e.developerId === req.params.developer) ? a.concat(e) : a, [])
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details for a single developer app from the repo. developer must be the developerId
router.get('/repo/details/:developer/:app', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath.replace('developers', 'developerApps'));
    responseHelper.handleResponse(res, `Details for app ${req.params.app} from repo`,
      data.find(x => x.developerId === req.params.developer && x.name === req.params.app)
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// export a developer. Also export any apps for the developer
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var data = [];
    var appData = [];

    await Promise.all(req.body.map(async (el) => {
      // get the developer info
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el}`, res.locals.user);
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        let company = JSON.parse(response.body);
        data.push(company);

        // get any apps too if there are any
        if (company.apps.length > 0) {
          await Promise.all(company.apps.map(async (app) => {
            let appResponse = await apigee.get(`${res.locals.apiEndpoint}/${el}/apps/${app}`, res.locals.user);
            if (!(appResponse.statusCode >= 400 && appResponse.statusCode <= 500)) {
              appData.push(JSON.parse(appResponse.body));
            }
          }));
        }
      }
    }));

    await fileHelper.write(res.locals.repoFilePath, data);
    await fileHelper.write(res.locals.repoFilePath.replace('developers', 'developerApps'), appData);
    responseHelper.handleResponse(res, `Exported developers and developer apps`, { developers: data, apps: appData });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// import a developer into apigee. developer must be the developerId
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var results = [];
    var fileData = await fileHelper.read(res.locals.repoFilePath);

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.developerId === el);
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished importing developers`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// import a developer app into apigee. developer must be the developerId
router.post('/apigee/:developer', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var results = [];
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('developers', 'developerApps'));

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      // get the developer app data from the repo
      var data = fileData.find(x => x.name === el);

      // import the developer app
      if (data) {
        // update the apps developerId to reflect the developer parameter
        data.developerId = req.params.developer;

        results.push(new ApigeeResponse(
          await apigee.post(`${res.locals.apiEndpoint}/${req.params.developer}/apps`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished importing apps for developer ${req.params.developer}`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a developer in apigee
router.put('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath);
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.developerId === el);
      results.push(new ApigeeResponse(
        await apigee.put(`${res.locals.apiEndpoint}/${el}`, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished updating developers`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a developer app in apigee
router.put('/apigee/:developer', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('developers', 'developerApps'));
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      if (data) {
        results.push(new ApigeeResponse(
          await apigee.put(`${res.locals.apiEndpoint}/${req.params.developer}/apps/${el}`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished updating developer apps`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a developer
router.delete('/:developer', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.developer}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete developer ${req.params.developer}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// delete a developer app
router.delete('/:developer/:app', validateHostName, async(req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.developer}/apps/${req.params.app}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete developer app ${req.params.app}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;