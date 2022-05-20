/**
 * SellersController.js
 * @description : exports action methods for Users.
 */

const Catalogs = require('../../model/Catalogs');
const CatalogsSchemaKey = require('../../utils/validation/CatalogsValidation');
const Products = require('../../model/Products');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');


/**
 * @description : create catalog document
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Catalogs. {status, message, data}
 */
const createCatalog = async (req, res) => {
    try {
        let dataToCreate = { ...req.body || {} };
        let validateRequest = validation.validateParamsWithJoi(
            dataToCreate,
            CatalogsSchemaKey.schemaKeys);
        if (!validateRequest.isValid) {
            return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
        }
        dataToCreate.addedBy = req.user.id;
        dataToCreate = new Catalogs(dataToCreate);
        let createdCatalogs = await dbService.create(Catalogs, dataToCreate);
        return res.success({ data: createdCatalogs });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * @description : create product document , no authentication , Add multiple products
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created products. {status, message, data}
 */
const createProduct = async (req, res) => {
    try {
        if (req.body && (!Array.isArray(req.body) || req.body.length < 1)) {
            return res.badRequest();
        }
        let dataToCreate = [...req.body];
        let createdProductss = await dbService.create(Products, dataToCreate);
        createdProductss = { count: createdProductss ? createdProductss.length : 0 };
        return res.success({ data: { count: createdProductss.count || 0 } });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    createCatalog,
    createProduct
};