var logger = require('../utils/winstonLogger');

/**
 * Log a verbose message useing winston
 * @param {string} message Message to be logged
 */
exports.verbose = (message) => {
  logger.verbose(message);
}

/**
 * Log a successful API call. Apigee doesn't always return unsuccessful requests as errors, so in cases where we get a response
 * code between 400 and 500 we log an error instead
 * @param {*} result response data to be transformed and logged
 */
exports.result = (result) => {
  var response = '';
  if (result.body) {
    try {
      response = JSON.parse(result.body);
    }
    catch (e) {
      response = result.body;
    }
  }
  if (result.statusCode >= 400 && result.statusCode <= 500) {
    logger.error(result.statusMessage, { meta: { message: result.statusMessage, statusCode: result.statusCode, data: response } })
  } else {
    logger.info(result.statusMessage, { meta: { message: result.statusMessage, statusCode: result.statusCode, data: response } });
  }
}

/**
 * Log an error
 * @param {*} error error data 
 */
exports.error = (error) => {
  var message = 'An error occured!';
  var statusCode = 500;

  if (error.message) {
    message = error.message;
  }
  if (!error.statusCode && error.message) {
    if (error.message.indexOf('statusCode=') !== -1) {
      statusCode = error.message.substr(error.message.indexOf('=') + 1);
    }
    if (error.message.indexOf('cause=') !== -1) {
      message = error.message.substr(error.message.indexOf('=') + 1);
    }
  }
  logger.error(message, { meta: { message: message, statusCode: statusCode, data: error } });
}