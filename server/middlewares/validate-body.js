var responseHelper = require('../helpers/response-helper'),
  logger = require('../helpers/logger-helper'),
  fileHelper = require('../helpers/file-helper');

/**
 * Validates that the request body exists and is valid. Also removes duplicate parameters
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = (req, res, next) => {
  // check the body is valid: string[]
  if (!req.body.length || req.body.length === 0) {
    return responseHelper.handleError(res, { statusCode: 400, statusMessage: 'Invalid request body' });
  }
  var errorOccured;
  req.body.forEach(async (el) => {
    // ensure the element is of type string
    if (typeof el !== 'string' && !errorOccured) {
      errorOccured = true;
      // return responseHelper.handleError(res, {statusCode: 400, statusMessage: 'Request body must be an array of string values'});
    }
  });
  if (errorOccured) {
    return responseHelper.handleError(res, { statusCode: 400, statusMessage: 'Request body must be an array of string values' });
  } else {
    // remove duplicates from the array
    req.body = [...new Set(req.body)];
    next();
  }
};