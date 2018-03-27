var path = require('path'),
  responseHelper = require('../helpers/response-helper'),
  fileHelper = require('../helpers/file-helper'),
  logger = require('../helpers/logger-helper');

/**
 * check that each element exists in the file we're reading. If they dont, log it and remove them from the req.body
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = async (req, res, next) => {
  try {
    var fileData = await fileHelper.read(path.resolve(__dirname, res.locals.repoFilePath));
    var entries = [];

    req.body.forEach(el => {
      if (!fileData.find(x => x.developerId ? x.developerId === el : x.id ? x.id === el : x.name === el)) {
        logger.error(`${el} not found in ${res.locals.repoFilePath}!`);
      } else {
        entries.push(el);
      }
    });
    req.body = entries;
    next();
  }
  catch (e) {
    return responseHelper.handleError(res, e);
  }
};