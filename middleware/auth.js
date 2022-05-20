/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const passport = require('passport');
const userTokens = require('../model/userTokens');
const dbService = require('../utils/dbService');

/**
 * @description : returns callback that verifies required rights and access
 * @param {Object} req : request of route.
 * @param {callback} resolve : resolve callback for succeeding method.
 * @param {callback} reject : reject callback for error.
 * @param {int} platform : platform
 */
const verifyCallback = (req, resolve, reject) => async (error, user, info) => {
  if (error || info || !user) {
    return reject('Unauthorized User');
  }
  req.user = user;
  if (!user.isActive) {
    return reject('User is deactivated');
  }
  let userToken = await dbService.findOne(userTokens, {
    token: (req.headers.authorization).replace('Bearer ', ''),
    userId: user.id
  });
  if (!userToken) {
    return reject('Token not found');
  }
  if (userToken.isTokenExpired) {
    return reject('Token is Expired');
  }
  resolve();
};

/**
 * @description : authentication middleware for request.
 * @param {Object} req : request of route.
 * @param {Object} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 * @param {int} platform : platform
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('device-rule', { session: false }, verifyCallback(req, resolve, reject))(
      req,
      res,
      next
    );
  })
    .then(() => next())
    .catch((error) => {
      return res.badRequest({ message: error.message });
    });
};

module.exports = auth;
