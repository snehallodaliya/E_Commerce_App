/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  API_SECRET:'myjwtdevicesecret',
  EXPIRES_IN: 10000
};

const USER_TYPES = { "Buyer":1,"Seller":2 };

module.exports = {
  JWT,
  USER_TYPES
};