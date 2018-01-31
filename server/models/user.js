var path = require('path'),
  fileHelper = require('../helpers/file-helper'),
  btoa = require('btoa');

/**
 * User class handles all operation related directly to the user. Users are stored in the ../resources directory as opposed to 
 * a database
 */
class User {
  constructor(userData) {
    this.username = userData.username;
    this.apiBasicAuthCredentials = `Basic ${btoa(userData.username + ':' + userData.password)}`;
    this.config = {
      orgs: null,
      repoParentDirectory: null,
      apiHostName: null,
      ssl: {
        enable: false,
        key: null,
        cert: null,
        passphrase: null
      },
      proxy: {
        enable: false,
        username: null,
        password: null,
        scheme: null,
        host: null,
        port: null
      },
      tests: []
    }
  }
}

/**
 * Creates a new user in the resources directory 
 * @param {User} user username and password
 */
exports.create = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), new User(user));
      resolve();
    }
    catch (e) {
      reject(e);
    }
  });
}

/**
 * Get the details of the current user
 * @param {string} username Users username
 */
exports.get = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      var exists = await fileHelper.checkExists(path.resolve(__dirname, `../resources/users/${username}`));
      if (!exists) {
        return resolve();
      }
      resolve(await fileHelper.read(path.resolve(__dirname, `../resources/users/${username}/config.json`)));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Update the user configuration
 * @param {*} user User
 * @param {*} data new data
 */
exports.updateUserConfig = (user, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      Object.keys(data).forEach(key => {
        user.config[key] = data[key];
      });
      resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * create a new set of postman tests
 * @param {User} user user data
 * @param {string} id postman test suite ID
 * @param {string} name postman test suite name
 * @param {*} files uploaded files
 */
exports.createTest = (user, id, name, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!user.config.tests.find(x => x.id === id)) {
        user.config.tests.push({
          id: id,
          name: name,
          collection: files['collection'] ? files['collection'][0].originalname : null,
          environment: files['environment'] ? files['environment'][0].originalname : null
        });
      }
      resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Get the collection and environment details for a test
 * @param {User} user user data 
 * @param {string} id postman test suite ID
 */
exports.getTests = (user, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      var collection = await fileHelper.read(path.resolve(__dirname, `../resources/users/${user.username}/tests/${id}/collection.json`));
      var environment = await fileHelper.read(path.resolve(__dirname, `../resources/users/${user.username}/tests/${id}/environment.json`));
      resolve({ collection: collection, environment: environment });
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Update existing postman tests
 * @param {User} user user data
 * @param {string} id postman test suite ID
 * @param {string} name postman test suite name
 * @param {*} files uploaded files
 */
exports.updateTest = (user, id, name, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (user.config.tests.find(x => x.id === id)) {
        user.config.tests[user.config.tests.findIndex(x => x.id === id)].name = name;
        if (files['collection']) { user.config.tests[user.config.tests.findIndex(x => x.id === id)].collection = files['collection'][0].originalname; }
        if (files['environment']) { user.config.tests[user.config.tests.findIndex(x => x.id === id)].environment = files['collection'][0].originalname; }

        resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
      }
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Delete a postman test
 * @param {User} user user data
 * @param {string} id postman test suite ID
 */
exports.deleteTest = (user, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (user.config.tests.find(x => x.id === id)) {
        user.config.tests.splice(user.config.tests.findIndex(x => x.id === id), 1);
        return resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
      } else {
        return reject(`${id} not found!`);
      }
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * update the users proxy settings
 * @param {User} user user data 
 * @param {*} proxy new proxy settings
 */
exports.setProxy = (user, proxy) => {
  return new Promise(async (resolve, reject) => {
    try {
      user.config.proxy = {
        enable: proxy.enable,
        username: proxy.username || user.config.proxy.username || null,
        password: proxy.password || user.config.proxy.password || null,
        scheme: proxy.scheme || user.config.proxy.scheme || null,
        host: proxy.host || user.config.proxy.host || null,
        port: proxy.port || user.config.proxy.port || null
      };
      resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * Set up enabled MASSL
 * @param {User} user user data
 * @param {string} passphrase SSL passphrase
 * @param {*} files SSL key and cert file
 */
exports.setMASSL = (user, passphrase, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      user.config.ssl = {
        enable: true,
        passphrase: passphrase,
        key: files && files['key'] ? files['key'][0].path : null,
        cert: files && files['cert'] ? files['cert'][0].path : null
      };
      resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * disable MASSL
 * @param {User} user user data
 */
exports.disableMASSL = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      user.config.ssl = {
        enable: false,
        key: null,
        cert: null
      };
      resolve(await fileHelper.write(path.resolve(__dirname, `../resources/users/${user.username}/config.json`), user));
    }
    catch (e) {
      return reject(e);
    }
  });
}

/**
 * delete the user
 * @param {User} user user data 
 */
exports.delete = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await fileHelper.delete(path.resolve(__dirname, `../resources/users/${user.username}`)));
    }
    catch (e) {
      return reject(e);
    }
  });
}