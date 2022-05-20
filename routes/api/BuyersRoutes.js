/**
 * BuyersRoutes.js
 * @description :: API routes for Buyers
 */

 const express = require('express');
 const router = express.Router();
 const BuyersController = require('../../controller/api/BuyerController');
 const auth = require('../../middleware/auth');

 router.route('/list-of-sellers').get(auth(),BuyersController.listOfSellers);
 
 module.exports = router;
 