/**
 * index.js
 * @description :: index route file of device platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/api/auth',require('./auth'));
router.use('/api/buyer',require('./BuyersRoutes'));
router.use('/api/seller',require('./SellersRoutes'));

module.exports = router;
