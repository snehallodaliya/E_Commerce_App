/**
 * BuyersController.js
 * @description : exports action methods for Users.
 */

const Users = require('../../model/Users');
const Orders = require('../../model/Orders');
const OrdersSchemaKey = require('../../utils/validation/OrdersValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const authConstant = require('../../constants/authConstant');


/**
 * @description : find all documents of Seller from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Seller(s). {status, message, data}
 */
const listOfSellers = async (req, res) => {
    try {
        let options = {};
        let query = {userType: authConstant.USER_TYPES.Seller};
        if (typeof req.body.query === 'object' && req.body.query !== null) {
            query = { ...req.body.query };
        }
        if (req.body && req.body.query && req.body.query._id) {
            query._id.$in = [req.body.query._id];
        }
        if (req.body.isCountOnly) {
            let totalRecords = await dbService.count(Users, query);
            return res.success({ data: { totalRecords } });
        }
        if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
            options = { ...req.body.options };
        }
        let foundSellers = await dbService.paginate(Users, query, options);
        if (!foundSellers || !foundSellers.data || !foundSellers.data.length) {
            return res.recordNotFound();
        }
        return res.success({ data: foundSellers });
    } catch (error) {
        console.log(error)
        return res.internalServerError({ message: error.message });
    }
};

/**
 * @description : find document of Catalogs from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Catalogs. {status, message, data}
 */
 const getSellerCatalogs = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundCatalogs = await dbService.findOne(Catalogs,query, options);
      if (!foundCatalogs){
        return res.recordNotFound();
      }
      return res.success({ data :foundCatalogs });
    }
    catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

/**
 * @description : create document of Orders in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Orders. {status, message, data}
 */ 
 const createOrders = async (req, res) => {
    try {
      let dataToCreate = { ...req.body,sellerId:req.params.seller_id || {} };
      let validateRequest = validation.validateParamsWithJoi(
        dataToCreate,
        OrdersSchemaKey.schemaKeys);
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      dataToCreate = new Orders(dataToCreate);
      let createdOrders = await dbService.create(Orders,dataToCreate);
      return res.success({ data : createdOrders });
    } catch (error) {
      return res.internalServerError({ message:error.message }); 
    }
  };

module.exports = {
    listOfSellers,
    getSellerCatalogs,
    createOrders
};