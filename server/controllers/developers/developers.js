const express = require('express');
const router = express.Router();

// middlewares
const verifyJWT = require('../../middlewares/verify-jwt');
const validateHostName = require('../../middlewares/validate-host-name');
const validateOrg = require('../../middlewares/validate-org');

// helpers
const responseHelper = require('../../helpers/response-helper');

// models
const apigee = require('../../models/apigee');

// called on every request
router.use('/', verifyJWT, validateOrg, (req, res, next) => {
  res.locals.apiEndpoint = `${res.locals.org}/developers`;
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

// details of a developer from apigee
router.get('/apigee/details/:developer', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Developer ${req.params.developer} details`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}`, res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// apps for a developer
router.get(`/apigee/list/:developer`, validateHostName, async(req, res, next) => {
  try {
    var result = await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}/apps`, res.locals.user);
    responseHelper.handleResponse(res, `Apps for delveloper ${req.params.developer}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// details of a developer app
router.get('/apigee/details/:developer/:app', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `App ${req.params.app} details from developer ${req.params.developer}`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.developer}/apps/${req.params.app}`, res.locals.user));
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