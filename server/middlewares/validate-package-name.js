var path = require('path'),
  responseHelper = require('../helpers/response-helper'),
  apigee = require('../models/apigee'),
  fileHelper = require('../helpers/file-helper'),
  logger = require('../helpers/logger-helper');

/**
 * Confirm that a packages name and display name dont already exist in Apigee.
 * @param {*} req express req
 * @param {*} res express res
 * @param {*} next express next
 */
module.exports = async (req, res, next) => {
  try {
    var entries = [];
    var fileData = await fileHelper.read(path.resolve(__dirname, res.locals.repoFilePath));

    var apigeePackagesData = await apigee.get(res.locals.apiEndpoint, res.locals.user, true);
    var apigeePackages = JSON.parse(apigeePackagesData.body);

    req.body.forEach(el => {
      var localPackage = fileData.find(x => x.id === el);
      if (apigeePackages.monetizationPackage.find(x => x.displayName === localPackage.displayName || x.name === localPackage.name)) {
        logger.error(`${localPackage.id} not imported! Package with duplicate name or display name already exists in Apigee!`);
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