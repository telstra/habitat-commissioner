var responseHelper = require('../helpers/response-helper');

/**
 * Validate the Apigee management API host name is supplied in the users configuration data
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = (req, res, next) => {
  if(!res.locals.user) {
    return responseHelper.handleError(res, 'JWT verification failed!');
  }
  if(!res.locals.user.config || res.locals.user.config && !res.locals.user.config.apiHostName) {
    return responseHelper.handleError(res, 'Management API host name has not been set. Please update the user configuration with the API host name before making API calls');
  }
  next();
};