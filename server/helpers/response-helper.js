var config = require('../config/config'),
  ApigeeError = require('../models/apigee-error'),
  ApigeeResponse = require('../models/apigee-response');

/**
 * Handle a successful request and finish the API call
 * @param {*} res Exporess res object so we can successfully end the API call 
 * @param {*} message a message to be included with the response
 * @param {*} data response data
 */
exports.handleResponse = (res, message, data) => {
  return res.status(data && data.statusCode && data.statusCode !== 204 ? data.statusCode : 200).json(
    new ApigeeResponse(data, message)
  );
}

/**
 * Handle an unsuccessful request and finish the API call
 * @param {*} res Exporess res object so we can successfully end the API call 
 * @param {*} e error data
 */
exports.handleError = (res, e) => {
  return e.body ?
    res.status(e.body.code || 500).json(
      new ApigeeError(e)
    ) :
    res.status(e.statusCode || 500).json(
      new ApigeeError(e)
    );
}