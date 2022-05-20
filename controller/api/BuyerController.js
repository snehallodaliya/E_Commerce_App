/**
 * BuyersController.js
 * @description : exports action methods for Users.
 */

const Users = require('../../model/Users');
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


module.exports = {
    listOfSellers,
};