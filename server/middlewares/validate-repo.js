var responseHelper = require('../helpers/response-helper');
var fileHelper = require('../helpers/file-helper');
var path = require('path');

/**
 * Validate and construct the repo path
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = async (req, res, next) => {
  if(!req.query.repo) {
    return responseHelper.handleError(res, 'Repo cannot be null');
  }
  if(!res.locals.user.config.repoParentDirectory) {
    return responseHelper.handleError(res, `No repo parent directory set!`);
  }
  if(!(await fileHelper.checkExists(path.resolve(__dirname, `${res.locals.user.config.repoParentDirectory}/${req.query.repo}`)))) {
    return responseHelper.handleError(res, `Repo '${req.query.repo}' not found!`);
  }
  // construct the repo file path and store it in res.locals
  res.locals.repoFilePath = `${res.locals.user.config.repoParentDirectory}/${req.query.repo}${res.locals.repoExtension ? '/' + res.locals.repoExtension : ''}`;
  next();
};