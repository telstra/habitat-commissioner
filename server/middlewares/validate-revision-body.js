var responseHelper = require('../helpers/response-helper');

/**
 * Validate the request body for exporting proxies and shared flows is correct
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = (req, res, next) => {
  var error;

  if (!req.body || !req.body.length || req.body.length === 0) {
    return responseHelper.handleError(res, 'Invalid request body!');
  }

  for (let el of req.body) {
    if (typeof el !== 'object' || (!el.name || !el.revision_number)) {
      error = `Invalid request body!`;
      break;
    }
    if(req.body.reduce((a, e, i) => (e.name === el.name) ? a.concat(i) : a, []).length > 1) {
      error = `Cannot perform operations on multiple revisions of the same item. Please provide only unique items!`;
      break;
    }
  }

  if (error) {
    return responseHelper.handleError(res, {statusCode: 404, statusMessage: error});
  }
  next();
};