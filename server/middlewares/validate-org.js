var responseHelper = require('../helpers/response-helper');

/**
 * Validate that an org is supplied in the request query and that it exists in the users configuration data
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = (req, res, next) => {
  if(!res.locals.user.config.orgs) {
    return responseHelper.handleError(res, 'No orgs set in configuration!');
  }
  if (!req.query.org) {
    return responseHelper.handleError(res, 'Organization cannot be null');
  }
  if (res.locals.user.config.orgs.indexOf(req.query.org) === -1) {
    return responseHelper.handleError(res, { message: `Organization '${req.query.org}' not found in configuration`, available_orgs: res.locals.user.config.orgs });
  }
  res.locals.org = req.query.org;
  next();
};