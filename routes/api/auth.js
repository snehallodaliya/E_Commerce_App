/**
 * auth.js
 * @description :: routes of authentication APIs
 */

const express =  require('express');
const router  =  express.Router();
const auth = require('../../middleware/auth');
const authController =  require('../../controller/api/authController');

router.route('/register').post(authController.register);
router.post('/login',authController.login);
router.route('/logout').post(auth, authController.logout);
module.exports = router;