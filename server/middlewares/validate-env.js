var responseHelper = require('../helpers/response-helper');
const apigee = require('../models/apigee');

/**
 * Validate the env paramter in the request query
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = async (req, res, next) => {
  try {
    if (!req.query.env) {
      return responseHelper.handleError(res, 'Environment cannot be null');
    }
    // verify the env actually exists in the org by making a management API call. This adds a lot of extra time to every request
    // that requires env to be set.
    // var envs = await apigee.get(`${res.locals.org}/envs`, res.locals.user);
    // if(JSON.parse(envs.body).indexOf(req.query.env) === -1) {
    //   return responseHelper.handleError(res, `Environment ${req.query.env} not found in organization ${res.locals.org}!`);
    // }
    res.locals.env = req.query.env;
    next();
  }
  catch (e) {
    return responseHelper.handleError(res, e);
  }
};