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
  res.locals.apiEndpoint = `${res.locals.org}/companies`;
  res.locals.repoExtension = `/config/org/${res.locals.org}/companies.json`;
  next();
});

// list all companies in apigee
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `Companies from apigee`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details for a company in apigee
router.get('/apigee/details/:company', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Company ${req.params.company} details`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.company}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// apps for a company in apigee
router.get(`/apigee/list/:company`, validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.get(`${res.locals.apiEndpoint}/${req.params.company}/apps`, res.locals.user);
    responseHelper.handleResponse(res, `Apps for company ${req.params.company}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// details of a company app in apigee
router.get('/apigee/details/:company/:app', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `App ${req.params.app} details from company ${req.params.company}`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.company}/apps/${req.params.app}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list all companies in the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Companies from repo`, await fileHelper.read(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of a company from the repo
router.get('/repo/details/:company', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath);
    responseHelper.handleResponse(res, `Company ${req.params.company} from repo`,
      data[data.findIndex(x => x.name === req.params.company)] || { error: "Not found" }
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get list of company apps from the repo
router.get('/repo/list/:company', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));
    responseHelper.handleResponse(res, `Apps for company ${req.params.company}`,
      data.reduce((a, e, i) => (e.companyName === req.params.company) ? a.concat(e) : a, [])
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details for a single company app from the repo
router.get('/repo/details/:company/:app', validateRepo, async (req, res, next) => {
  try {
    var data = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));
    responseHelper.handleResponse(res, `Details for app ${req.params.app} from repo`,
      data.find(x => x.companyName === req.params.company && x.name === req.params.app)
    );
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// export a company. Also export any apps for the company
router.post('/repo', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var data = [];
    var appData = [];

    await Promise.all(req.body.map(async (el) => {
      // get the company info
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
    await fileHelper.write(res.locals.repoFilePath.replace('companies', 'companyApps'), appData);
    responseHelper.handleResponse(res, `Exported companies and company apps`, { companies: data, apps: appData });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// import a company into apigee
router.post('/apigee', validateHostName, validateRepo, validateBody, validateEntryExists, async (req, res, next) => {
  try {
    var results = [];
    var fileData = await fileHelper.read(res.locals.repoFilePath);

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      results.push(new ApigeeResponse(
        await apigee.post(res.locals.apiEndpoint, res.locals.user, false, data)
      ));
    }));
    responseHelper.handleResponse(res, `Finished importing companies`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// import a company app into apigee
router.post('/apigee/:company', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var results = [];
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));

    // for each name in the req.body, match with the file data and import
    await Promise.all(req.body.map(async (el) => {
      // get the company app data from the repo
      var data = fileData.find(x => x.name === el);

      // import the company app
      if (data) {
        // update the apps companyName to reflect the company parameter
        data.companyName = req.params.company;

        results.push(new ApigeeResponse(
          await apigee.post(`${res.locals.apiEndpoint}/${req.params.company}/apps`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished importing apps for company ${req.params.company}`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a company in apigee
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
    responseHelper.handleResponse(res, `Finished updating companies`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update a company app in apigee
router.put('/apigee/:company', validateHostName, validateRepo, validateBody, async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(res.locals.repoFilePath.replace('companies', 'companyApps'));
    var results = [];

    await Promise.all(req.body.map(async (el) => {
      var data = fileData.find(x => x.name === el);
      if (data) {
        results.push(new ApigeeResponse(
          await apigee.put(`${res.locals.apiEndpoint}/${req.params.company}/apps/${el}`, res.locals.user, false, data)
        ));
      }
    }));
    responseHelper.handleResponse(res, `Finished updating company apps`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a company
router.delete('/:name', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete company ${req.params.name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a company app
router.delete('/:company/:app', validateHostName, async (req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.company}/apps/${req.params.app}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete company app ${req.params.app}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;