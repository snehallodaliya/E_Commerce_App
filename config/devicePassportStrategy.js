/**
 * @description : exports authentication strategy for device using passport.js
 * @params {Object} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */
 
const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const Users = require('../model/Users');

const devicePassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = JWT.API_SECRET;
  passport.use('device-rule',
    new Strategy(options, async (payload, done) => {
      try {
        const result = await Users.findOne({ _id: payload.id });
        if (result) {
          return done(null, result.toJSON());
        }
        return done('No User Found', {});
      } catch (error) {
        return done(error,{});
      }
    })
  );   
};

module.exports = { devicePassportStrategy };