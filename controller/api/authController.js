/**
 * authController.js
 * @description :: exports authentication methods
 */

const Users = require('../../model/Users');
const dbService = require('../../utils/dbService');
const userTokens = require('../../model/userTokens');
const dayjs = require('dayjs');
const {schemaKeys} = require('../../utils/validation/UsersValidation');
const validation = require('../../utils/validateRequest');
const authService = require('../../services/auth');
const common = require('../../utils/common');

/**
 * @description : user registration 
 * @param {Object} req : request for register
 * @param {Object} res : response for register
 * @return {Object} : response for register {status, message, data}
 */
const register = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    
    const data = new Users({
      ...req.body
    });

    let checkUniqueFields = await common.checkUniqueFieldsInDatabase(Users, ['username'], data, 'INSERT');
    if (checkUniqueFields.isDuplicate) {
      return res.validationError({ message: `${checkUniqueFields.value} already exists.Unique ${checkUniqueFields.field} are allowed.` });
    }

    const result = await dbService.create(Users, data);
    
    return res.success({ data: result });
  } catch (error) {
    console.log('error', error);
    return res.internalServerError({ data: error.message });
  }
};

/**
 * @description : login with username and password
 * @param {Object} req : request for login 
 * @param {Object} res : response for login
 * @return {Object} : response for login {status, message, data}
 */
const login = async (req, res) => {
  try {
    let {
      username, password
    } = req.body;
    if (!username || !password) {
      return res.badRequest({ message: 'Insufficient request parameters! username and password is required.' });
    }
    
    let result = await authService.loginUser(username, password);
    if (result.flag) {
      return res.badRequest({ message: result.data });
    }
    return res.success({
      data: result.data,
      message: 'Login Successful'
    });
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

/**
 * @description : logout user
 * @param {Object} req : request for logout
 * @param {Object} res : response for logout
 * @return {Object} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    let userToken = await dbService.findOne(userTokens, {
      token: (req.headers.authorization).replace('Bearer ', ''),
      userId: req.user.id
    });
    let updatedDocument = { isTokenExpired: true };
    await dbService.updateOne(userTokens, { _id: userToken.id }, updatedDocument);
    return res.success({ message: 'Logged Out Successfully' });
  } catch (error) {
    return res.internalServerError({ data: error.message });
  }
};

module.exports = {
  register,
  login,
  logout
};