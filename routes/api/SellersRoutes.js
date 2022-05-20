/**
 * BuyersRoutes.js
 * @description :: API routes for Buyers
 */

 const express = require('express');
 const router = express.Router();
 const SellersController = require('../../controller/api/SellerController');
 const auth = require('../../middleware/auth');

 router.route('/create-catalog').post(auth(),SellersController.createCatalog);
 router.route('/create-product').post(SellersController.createProduct);
 router.route('/orders/:id').get(auth(),SellersController.getOrders);

 
 module.exports = router;
 