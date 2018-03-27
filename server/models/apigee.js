var fs = require('fs-extra'),
  path = require('path'),
  extract = require('extract-zip'),
  requestHelper = require('../helpers/generateUrl'),
  logger = require('../helpers/logger-helper');

/**
 * All apigee management API calls are made here. The results are returned without being JSON parsed in most cases.
 * This is because apigee returns so much different stuff depending on what happens that its easier to resolve with the raw 
 * response and then do the data handling in the response handler and Habitat Commissioner API routes.
 */

/**
 * GET
 */
exports.get = (resourcePath, userData, isMonetization) => {
  return new Promise((resolve, reject) => {
    var options = requestHelper.urlOptions(resourcePath, userData, isMonetization);
    var r = requestHelper.request(userData);
    r.get(options, (err, res) => {
      logger.verbose(`Get ${resourcePath}`);
      if (err) {
        //logger.error(err);
        return reject(err);
      }
      //logger.result(res);
      resolve(res);
    });
  });
}

/**
 * POST
 */
exports.post = (resourcePath, userData, isMonetization, body) => {
  return new Promise((resolve, reject) => {
    var options = requestHelper.urlOptions(resourcePath, userData, isMonetization, body);
    var r = requestHelper.request(userData);
    r.post(options, async (err, res) => {
      logger.verbose(`Post ${body.name ? body.name : body.id || ''} at ${resourcePath}`);
      if (err) {
        logger.error(err);
        return reject(err);
      }
      logger.result(res);
      resolve(res);
    });
  });
};

/**
 * PUT
 */
exports.put = async (resourcePath, userData, isMonetization, body) => {
  return new Promise(async (resolve, reject) => {
    var options = requestHelper.urlOptions(resourcePath, userData, isMonetization, body);
    var r = requestHelper.request(userData);
    r.put(options, (err, res) => {
      logger.verbose(`Put ${body.name ? body.name : body.id || ''} at ${resourcePath}`);
      if (err) {
        logger.error(err);
        return reject(err);
      }
      logger.result(res);
      resolve(res);
    });
  });
};

/**
 * DELETE
 */
exports.delete = async (resourcePath, userData, isMonetization) => {
  return new Promise((resolve, reject) => {
    var options = requestHelper.urlOptions(resourcePath, userData, isMonetization);
    var r = requestHelper.request(userData);
    r.delete(options, (err, res) => {
      logger.verbose(`Delete at ${resourcePath}`);
      if (err) {
        logger.error(err);
        return reject(err);
      }
      logger.result(res);
      resolve(res);
    });
  });
}

/**
 * Downloads a zip from apigee and unzips it
 */
exports.export = (resourcePath, extractPath, userData) => {
  return new Promise(async (resolve, reject) => {

    await fs.ensureDir(path.resolve(__dirname, `../resources/tmp/${userData.username}`));
    var exportPath = path.resolve(__dirname, `../resources/tmp/${userData.username}/${resourcePath.split('/')[2]}@#${Math.floor(Date.now() / 1000)}.zip`);

    var options = requestHelper.urlOptions(resourcePath, userData);
    options.headers['Content-Type'] = 'application/octet-stream';
    var r = requestHelper.request(userData);

    r.get(options)
      .on('error', (err) => {
        logger.error(err);
        return reject(err);
      })
      .on('response', (res) => {
        logger.verbose(`Exporting ${resourcePath.split('/')[2]}`);
      })
      .pipe(fs.createWriteStream(exportPath))
      .on('close', () => {
        // unzip and delete zip file
        extract(exportPath, { dir: extractPath }, (err) => {
          if (err) {
            logger.error(err);
            return reject(err);
          }
          logger.verbose(`${resourcePath.split('/')[2]} unzipped to ${extractPath}`);

          // delete the zip we downloaded now that extraction is done
          fs.unlink(exportPath, (err) => {
            if (err) {
              logger.error(err);
            }
            resolve();
          });
        });
      });
  });
}

/**
 * Returns the deployed revision in the specified environment
 */
exports.getDeployedRevisionInEnvironment = (resourcePath, env, userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get all the revisions
      logger.verbose(`Check deployed revisions for ${resourcePath}`);

      var response = await this.get(`${resourcePath}/revisions`, userData);
      // error check
      if (response.statusCode >= 400 && response.statusCode <= 500) {
        return reject(response);
      }
      var revisions = JSON.parse(response.body);

      // find the deployed revision
      var deployedRevision;
      var i = revisions.length - 1;
      do {
        var details = await this.get(`${resourcePath}/revisions/${revisions[i]}/deployments`, userData);
        details = JSON.parse(details.body);

        if (details.environment && details.environment.length > 0) {
          if (details.environment.find(x => x.state === 'deployed').name === env) {
            deployedRevision = details;
            // break the loop
            i = 0;
          }
        }
        i--;
      } while (i >= 0);
      logger.verbose(`${deployedRevision ?
        'Revision ' + deployedRevision.name + ' deployed in ' + env :
        'No revision deployed in ' + env}`);
      resolve(deployedRevision);
    }
    catch (e) {
      logger.error(e);
      reject(e);
    }
  });
};

/**
 * Get deployments of an item
 */
exports.getDeployments = (resourcePath, userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get all the revisions
      logger.verbose(`Check deployed revisions for ${resourcePath}`);

      var response = await this.get(`${resourcePath}/revisions`, userData);
      // error check
      if (response.statusCode >= 400 && response.statusCode <= 500) {
        return reject(response);
      }
      var revisions = JSON.parse(response.body);

      // find the deployed revision
      var deployments = [];
      var i = revisions.length - 1;
      do {
        var details = await this.get(`${resourcePath}/revisions/${revisions[i]}/deployments`, userData);
        details = JSON.parse(details.body);

        if (details.environment && details.environment.length > 0) {
            deployments.push(details);
        }
        i--;
      } while (i >= 0);
      logger.verbose(`${deployments.length > 0 ?
        'Found deployments':
        'No deployments'}`);
      resolve(deployments);
    }
    catch (e) {
      logger.error(e);
      reject(e);
    }
  });
};

/**
 * Import a new revision of an item to apigee
 */
exports.importRevision = async (resourcePath, bundlePath, userData) => {
  return new Promise((resolve, reject) => {
    var options = requestHelper.urlOptions(resourcePath, userData);
    options.formData = {
      file: fs.createReadStream(bundlePath)
    };
    var r = requestHelper.request(userData);
    r.post(options, (err, res) => {
      logger.verbose(`Import ${resourcePath}`);
      if (err) {
        logger.error(err);
        return reject(err)
      }
      logger.result(res);
      resolve(JSON.parse(res.body));
    });
  });
};

/**
 * Deploy a revision
 */
exports.deploy = async (resourcePath, userData) => {
  return new Promise((resolve, reject) => {
    var options = requestHelper.urlOptions(`${resourcePath}?override=true`, userData);
    if (resourcePath.split('?')[0] === '/apis') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    var r = requestHelper.request(userData);
    r.post(options, (err, res) => {
      logger.verbose(`Deployed ${resourcePath}`);
      if (err) {
        logger.error(err);
        return reject(err)
      }
      logger.result(res);
      resolve(JSON.parse(res.body));
    });
  });
};