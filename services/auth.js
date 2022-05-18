/**
 * auth.js
 * @description :: functions used in authentication
 */

const Users = require('../model/Users');
const dbService = require('../utils/dbService');
const userTokens = require('../model/userTokens');
const {
  JWT, LOGIN_ACCESS,
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;

/**
 * @description : generate JWT token for authentication.
 * @param {Object} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user, secret) => {
  return jwt.sign({
    id: user.id,
    'username': user.username
  }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

/**
 * @description : login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @return {Object} : returns authentication status. {flag, data}
 */
const loginUser = async (username, password) => {
  try {
    let where = { 'username': username };
    let user = await dbService.findOne(Users, where);
    if (user) {
      if (password) {
        const isPasswordMatched = await user.isPasswordMatch(password);
        if (!isPasswordMatched) {
          return {
            flag: true,
            data: 'Incorrect Password'
          };
        }
      }
      const userData = user.toJSON();
      let token;
      if (!user.userType) {
        return {
          flag: true,
          data: 'You have not been assigned any role'
        };
      }
      token = await generateToken(userData, JWT.API_SECRET);
      let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
      await dbService.create(userTokens, {
        userId: user.id,
        token: token,
        tokenExpiredTime: expire
      });
      let userToReturn = {
        ...userData,
        token
      };
      return {
        flag: false,
        data: userToReturn
      };

    } else {
      return {
        flag: true,
        data: 'User not exists'
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  loginUser,
};