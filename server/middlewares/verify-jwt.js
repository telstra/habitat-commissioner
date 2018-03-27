var jwt = require('jsonwebtoken'),
  User = require('../models/user'),
  responseHelper = require('../helpers/response-helper'),
  config = require('../config/config');

/**
* Verify the supplied json web token
* @param {*} req express req
* @param {*} res express res
* @param {*} next express next
*/
module.exports = async (req, res, next) => {
  try {
    var decoded = await jwt.verify(req.get('token'), config.jwt.secret);

    // get the user
    var user = await User.get(decoded.username);
    if (!user) {
      return responseHelper.handleError(res, { statusCode: 404, message: `${decoded.username} doesnt exist!` });
    }
    res.locals.user = user;
    next();
  }
  catch (e) {
    return responseHelper.handleError(res, e);
  }
};