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

// models
const apigee = require('../../models/apigee');
var ApigeeResponse = require('../../models/apigee-response');

// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/sharedflows`;
  res.locals.repoExtension = `/sharedflows`;
  next();
});

// get list of shared flows
router.get('/apigee/list', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(res.locals.apiEndpoint, res.locals.user);
    responseHelper.handleResponse(res, `shared flows from apigee`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// list of shared flow revisions
router.get('/apigee/list/:name', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions`, res.locals.user);
    responseHelper.handleResponse(res, `Shared flow ${req.params.name} revisions`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get shared flow
router.get(`/apigee/details/:name`, validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);
    responseHelper.handleResponse(res, `Details for shared flow: ${req.params.name}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a single shared flow revision
router.get('/apigee/details/:name/:revision_number', validateHostName, async (req, res, next) => {
  try {
    var data = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}/deployments`, res.locals.user);
    responseHelper.handleResponse(res, `Details for shared flow ${req.params.name} revision ${req.params.revision_number}`, data);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get shared flow deployments
router.get(`/apigee/deployments/:name`, validateHostName, async(req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Deployments for shared flow ${req.params.name}`, await apigee.getDeployments(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user));
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// list of shared flows in the repo
router.get('/repo/list', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Shared flows from repo`, await fileHelper.readDir(res.locals.repoFilePath));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get details of a single shared flow from the repo
router.get('/repo/details/:name', validateRepo, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Details for shared flow ${req.params.name} from repo`, await xmlHelper.toJSON(`${res.locals.repoFilePath}/${req.params.name}/src/main/sharedflowbundle/${req.params.name}.xml`));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// post to apigee
router.post('/apigee', validateHostName, validateRepo, validateEnv, validateBody, async (req, res, next) => {
  try {
    var results = [];

    // import and deploy each shared flow. If a shared flow of the same name is already deployed, this new shared flow will
    // be deployed in its place by using the override flag
    await Promise.all(req.body.map(async (sharedflow) => {

      // check the file exists first
      if (await fileHelper.checkExists(`${res.locals.repoFilePath}/${sharedflow}`)) {

        // create a temp directory for the user if it doesnt exist
        await fileHelper.createDir(path.resolve(__dirname, `../../resources/tmp/${res.locals.user.username}`));

        // zip the bundle
        var destPath = path.resolve(__dirname, `../../resources/tmp/${res.locals.user.username}/${sharedflow}@#${Math.floor(Date.now() / 1000)}.zip`);
        await fileHelper.zip(
          `${res.locals.repoFilePath}/${sharedflow}/src/main`,
          destPath
        );

        // import the shared flow
        var imported = await apigee.importRevision(
          `${res.locals.apiEndpoint}?action=import&name=${sharedflow}`,
          destPath,
          res.locals.user
        );

        // delete the zip folder from tmp after importing
        await fileHelper.delete(destPath);

        // check if a previously deployed revision exists and undeploy it
        var deployed = await apigee.getDeployedRevisionInEnvironment(`${res.locals.apiEndpoint}/${sharedflow}`, res.locals.env, res.locals.user);
        if (deployed) {
          await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${sharedflow}/revisions/${deployed.name}/deployments`, res.locals.user);
        }

        // deploy the shared flow
        results.push(new ApigeeResponse(
          await apigee.deploy(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${sharedflow}/revisions/${imported.revision}/deployments`, res.locals.user)
        ));
      }
    }));

    responseHelper.handleResponse(res, `Successfully deployed shared flows`, results);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// export to repo
router.post('/repo', validateHostName, validateRepo, validateEnv, validateRevisionBody, async (req, res, next) => {
  try {
    var results = [];
    await Promise.all(req.body.map(async (el) => {

      // ensure the proxy and revision exist first
      var response = await apigee.get(`${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}/deployments`, res.locals.user)
      if (!(response.statusCode >= 400 && response.statusCode <= 500)) {
        results.push(JSON.parse(response.body));
        // export the shared flow
        await apigee.export(
          `${res.locals.apiEndpoint}/${el.name}/revisions/${el.revision_number}?format=bundle`,
          `${res.locals.repoFilePath}/${el.name}/src/main`,
          res.locals.user
        );
      }
    }));
    responseHelper.handleResponse(res, `Exported shared flows to repo`, results);
  }
  catch (e) {
    return responseHelper.handleError(res, e);
  }
});

// deploy a shared flow revision
router.post('/deploy/:name/:revision_number', validateHostName, validateEnv, async (req, res, next) => {
  try {
    // check the shared flow and revision exist before we undeploy anything
    var response = await apigee.get(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}`, res.locals.user);
    if (response.statusCode >= 400 && response.statusCode <= 500) {
      responseHelper.handleError(res, response);
    }

    // undeploy old shared flow revision if its in the same enironment we're deploying too
    var deployed = await apigee.getDeployedRevisionInEnvironment(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.env, res.locals.user);
    if (deployed) {
      await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${req.params.name}/revisions/${deployed.name}/deployments`, res.locals.user);
    }

    // deploy the new one
    var result = await apigee.deploy(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${req.params.name}/revisions/${req.params.revision_number}/deployments`, res.locals.user);

    responseHelper.handleResponse(res, `Deploy shared flow ${req.params.name} revision ${req.params.revision_number}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// undeploy a shared flow revision
router.delete('/undeploy/:name/:revision_number', validateHostName, validateEnv, async (req, res, next) => {
  try {
    // undeploy the revision
    var result = await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${req.params.name}/revisions/${req.params.revision_number}/deployments`, res.locals.user);

    responseHelper.handleResponse(res, `Undeploy shared flow ${req.params.name} revision ${req.params.revision_number}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a shared flow revision
router.delete('/:name/:revision_number', validateHostName, async (req, res, next) => {
  try {
    // delete the shared flow
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}/revisions/${req.params.revision_number}`, res.locals.user);

    responseHelper.handleResponse(res, `Delete shared flow ${req.params.name} revision ${req.params.revision_number}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete a shared flow
router.delete('/:name', validateHostName, validateEnv, async (req, res, next) => {
  try {
    // find the deployed revision
    var deployed = await apigee.getDeployedRevisionInEnvironment(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.env, res.locals.user);

    // undeploy it
    if (deployed) {
      await apigee.delete(`${res.locals.org}/environments/${res.locals.env}/sharedflows/${req.params.name}/revisions/${deployed.name}/deployments`, res.locals.user);
    }

    // delete the shared flow
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.name}`, res.locals.user);

    responseHelper.handleResponse(res, `Deleted shared flow ${req.params.name}`, result);
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;