const express = require('express');
const router = express.Router();
const crypto = require('crypto');
var path = require('path');
var multer = require('multer');

// middlewares
const verifyJWT = require('../middlewares/verify-jwt');

// helpers
const responseHelper = require('../helpers/response-helper');
var fileHelper = require('../helpers/file-helper');

// models
var User = require('../models/user');

// multer
// ssl cert storage configuration
var sslStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, path.resolve(__dirname, await fileHelper.createDir(path.resolve(__dirname, `../resources/users/${req.user.username}/ssl`))))
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
  }
});

// postman test files storage configuration
var postmanStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (!req.body.name) {
      return cb(new Error(`Name field is required!`), false);
    }
    cb(null, path.resolve(__dirname, await fileHelper.createDir(path.resolve(__dirname, `../resources/users/${req.user.username}/tests/${req.id}`))))
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}.json`)
  }
});

// only upload .pem files for MASSL
const pemFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(pem)$/)) {
    return cb(new Error(`${file.originalname} has an unsupported file type. Only .pem files are allowed. File not uploaded`), false);
  }
  cb(null, true);
};

// file filter for postman collection/ environment upload
const jsonFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(json)$/)) {
    return cb(new Error(`${file.originalname} has an unsupported file type. Only .json files are allowed. File not uploaded`), false);
  }
  cb(null, true);
};

// key and cert upload functions setup
var _sslUpload = multer({ storage: sslStorage, fileFilter: pemFilter });
var sslUpload = _sslUpload.fields([{ name: 'key', maxCount: 1 }, { name: 'cert', maxCount: 1 }]);

// postman collection/ environment upload functions set up
var _postmanUpload = multer({ storage: postmanStorage, fileFilter: jsonFilter });
var postmanUpload = _postmanUpload.fields([{ name: 'collection', maxCount: 1 }, { name: 'environment', maxCount: 1 }]);

// called on every request to verify the jwt
router.use('/', verifyJWT, (req, res, next) => {
  next();
});

// get the logged in user
router.get('/', async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, res.locals.user.username, await User.get(res.locals.user.username));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get folders in the repo parent directory
router.get('/repos', async (req, res, next) => {
  try {
    if (!res.locals.user.config.repoParentDirectory) {
      return responseHelper.handleError(res, `No repo parent directory set!`);
    }
    responseHelper.handleResponse(res, 'Repo directories', await fileHelper.readDir(res.locals.user.config.repoParentDirectory));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update the config for the logged in user
router.put('/', async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, 'Configuration updated', await User.updateUserConfig(res.locals.user, req.body));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update proxy settings
router.put('/proxy', async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, 'Proxy settings updated', await User.setProxy(res.locals.user, req.body));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// update ssl settings
router.post('/ssl', async (req, res, next) => {
  try {
    // dont upload new certs if they already exist
    if (res.locals.user.config.ssl.enable) {
      return responseHelper.handleError(res, { statusCode: 400, statusMessage: 'SSL key, cert and passphrase cannot be changed. Please delete the existing SSL settings and then update' });
    }

    req.user = res.locals.user;
    // upload certs
    sslUpload(req, res, async (err) => {
      if (err) {
        return responseHelper.handleError(res, err);
      }
      if (!Object.keys(req.files).length > 0) {
        return responseHelper.handleError(res, { statusCode: 400, statusMessage: 'Missing SSL files!' });
      }

      responseHelper.handleResponse(res, 'SSL enabled', await User.setMASSL(res.locals.user, req.body.passphrase, req.files));
    });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// disable ssl and delete the certs from the server
router.delete('/ssl', async (req, res, next) => {
  try {
    await fileHelper.delete(path.resolve(__dirname, `../resources/users/${res.locals.user.username}/ssl`))
    responseHelper.handleResponse(res, `SSL disabled`, await User.disableMASSL(res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// get a postman collection and environment
router.get('/tests/:id', async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `Details for test ${req.params.id}`, await User.getTests(res.locals.user, req.params.id));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// upload postman collection and environment
router.post('/tests', async (req, res, next) => {
  // do this so we can pass the user data in the req and use it with multer for stroage
  req.user = res.locals.user;
  req.id = crypto.randomBytes(16).toString("hex");

  // upload tests
  postmanUpload(req, res, async (err) => {
    try {
      if (err) {
        return responseHelper.handleError(res, err);
      }
      if (!Object.keys(req.files).length > 0) {
        return responseHelper.handleError(res, { statusCode: 400, statusMessage: 'Missing Postman files!' });
      }
      responseHelper.handleResponse(res, `Test ${req.body.name} created`, await User.createTest(res.locals.user, req.id, req.body.name, req.files));
    }
    catch (e) {
      responseHelper.handleError(res, e);
    }
  });
});

// update an existing test
router.put('/tests/:id', async (req, res, next) => {
  try {
    // for passing to the multer storage function
    req.user = res.locals.user;
    req.id = req.params.id;

    postmanUpload(req, res, async (err) => {
      try {
        if (err) {
          return responseHelper.handleError(res, err);
        }
        responseHelper.handleResponse(res, `Test updated`, await User.updateTest(res.locals.user, req.params.id, req.body.name, req.files));
      }
      catch (e) {
        responseHelper.handleError(res, e);
      }
    });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// remove postman test files from the user
router.delete('/tests/:id', async (req, res, next) => {
  try {
    // delete the folder from the server
    await fileHelper.delete(path.resolve(__dirname, `../resources/users/${res.locals.user.username}/tests/${req.params.id}`));
    // update the user config and return
    return responseHelper.handleResponse(res, 'Postman test deleted', await User.deleteTest(res.locals.user, req.params.id));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

// delete the logged in user
router.delete('/', async (req, res, next) => {
  try {
    responseHelper.handleResponse(res, `${res.locals.user.username} deleted`, await User.delete(res.locals.user));
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;