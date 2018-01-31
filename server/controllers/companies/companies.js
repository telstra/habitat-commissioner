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
  res.locals.apiEndpoint = `${res.locals.org}/companies`;
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

// apps for a company
router.get(`/apigee/list/:company`, validateHostName, async(req, res, next) => {
  try {
    var result = await apigee.get(`${res.locals.apiEndpoint}/${req.params.company}/apps`, res.locals.user);
    responseHelper.handleResponse(res, `Apps for company ${req.params.company}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// details of a company app
router.get('/apigee/details/:company/:app', validateHostName, async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `App ${req.params.app} details from company ${req.params.company}`, await apigee.get(`${res.locals.apiEndpoint}/${req.params.company}/apps/${req.params.app}`, res.locals.user));
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
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

// delete a company app
router.delete('/:company/:app', validateHostName, async(req, res, next) => {
  try {
    var result = await apigee.delete(`${res.locals.apiEndpoint}/${req.params.company}/apps/${req.params.app}`, res.locals.user);
    responseHelper.handleResponse(res, `Delete company app ${req.params.app}`, result);
  }
  catch(e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;