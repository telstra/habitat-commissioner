const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/config');

// helpers
const responseHelper = require('../helpers/response-helper');

// models
var User = require('../models/user');

// login a user, create if the user doesnt exist. This has got to be temporary
router.post('/login', async (req, res, next) => {
  try {
    // check if the user exists
    var user = await User.get(req.body.username);

    if (!user) {
      // create the user
      await User.create(req.body);
    }

    // create a jwt
    var token = jwt.sign({ username: req.body.username }, config.jwt.secret, { expiresIn: '2h' });

    responseHelper.handleResponse(res, `Hello, ${req.body.username}!`, { token: token });
  }
  catch (e) {
    responseHelper.handleError(res, e);
  }
});

module.exports = router;