var fs = require('fs-extra'),
  path = require('path'),
  zipFolder = require('zip-folder'),
  logger = require('./logger-helper'),
  mkdirp = require('mkdirp');

  /**
   * Check if a directory or file exists. Returns true if the resource exsists and false if it doesnt
   * @param {string} resourcePath path to file or folder
   */
exports.checkExists = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.access(resourcePath, (err) => {
      // logger.verbose(`Check if file exists at ${resourcePath}`);
      if (err) {
        return resolve();
      }
      resolve(true);
    });
  })
}

/**
 * Reads the contents of a directory and return
 * @param {string} resourcePath path to directory
 */
exports.readDir = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(resourcePath, (err, data) => {
      // logger.verbose(`Read dir at ${resourcePath}`);
      if (err) {
        return reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Read a JSON file and parse the data before returning
 * @param {string} resourcePath path to file JSON file
 */
exports.read = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(resourcePath, 'utf8', (err, data) => {
      // logger.verbose(`Read file at ${resourcePath}`);
      if (err) {
        return reject(err);
      } else {
        var result = null;
        if (data) { result = JSON.parse(data); }
        resolve(result);
      }
    });
  });
}

/**
 * Read a JSON and return as an array of string identifiers
 * @param {string} resourcePath path to JSON file
 */
exports.readList = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(resourcePath, 'utf8', (err, data) => {
      // logger.verbose(`Read file at ${resourcePath}`);
      if (err) {
        return reject(err);
      } else {
        var results = [];
        if (data) {
          JSON.parse(data).forEach(el => {
            results.push(
              el.displayName || el.name || el.id
            )
          });
        }
        resolve(results);
      }
    });
  });
}

/**
 * Create a directory at the specified resource path
 * @param {string} resourcePath path to directory location
 */
exports.createDir = (resourcePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.ensureDir(resourcePath);
      return resolve(resourcePath);
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Write data contents to a file at the specified resource path
 * @param {string} resourcePath file path
 * @param {*} data data to write
 */
exports.write = (resourcePath, data) => {
  return new Promise((resolve, reject) => {
    if(!data || Array.isArray(data) && data.length === 0) {
      return reject('No data to write!')
    }
    // delete some keys that we dont needs to write if they're there
    if (Array.isArray(data)) {
      data.forEach(el => {
        delete el.createdAt;
        delete el.createdBy;
        delete el.lastModifiedAt;
        delete el.lastModifiedBy;
      });
    }

    var lastSlash;
    resourcePath.lastIndexOf('/') > resourcePath.lastIndexOf('\\') ? lastSlash = '/' : lastSlash = '\\';

    mkdirp(resourcePath.substring(0, resourcePath.lastIndexOf(lastSlash)), (err, made) => {
      if (err) {
        return reject(err);
      }
      //logger.verbose(`Writing to ${resourcePath}`);
      fs.writeFile(resourcePath, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  });
}

/**
 * Zip the contents of a directory at the specifed source path and store the result at the destination path
 * @param {string} srcPath path to the directory to be zipped
 * @param {string} destPath path to store the zipped directory
 */
exports.zip = (srcPath, destPath) => {
  return new Promise((resolve, reject) => {
    fs.access(srcPath, (err) => {
      if (err) {
        return reject(err);
      }
      zipFolder(srcPath, destPath, (err, r) => {
        //logger.verbose(`Zipping ${srcPath}`);
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

/**
 * Delete a file or directory at the specified resource path
 * @param {string} resourcePath path to file or directory
 */
exports.delete = (resourcePath) => {
  return new Promise((resolve, reject) => {
    fs.remove(resourcePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}