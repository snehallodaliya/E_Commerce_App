/**
 * common.js
 * @description: exports helper methods for project.
 */

const mongoose = require('mongoose');
const dbService = require('./dbService');

/**
 * convertObjectToEnum : converts object to enum
 * @param {Object} obj : object to be converted
 * @return {Array} : converted Array
 */
function convertObjectToEnum (obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
}

/**
 * uniqueValidation: check unique validation while user registration
 * @param {Object} model : mongoose model instance of collection
 * @param {Object} data : data, coming from request
 * @return {boolean} : validation status
 */
async function uniqueValidation (Model,data){
  let filter = {};
  if (data && data['username'] ){
    filter = { 'username': data['username'] };
  }
  filter.isActive = true;
  filter.isDeleted = false;
  let found = await dbService.findOne(Model,filter);
  if (found){
    return false;
  }
  return true;
}

/**
 * getDifferenceOfTwoDatesInTime : get difference between two dates in time
 * @param {date} currentDate  : current date
 * @param {date} toDate  : future date
 * @return {string} : difference of two date in time
 */
function getDifferenceOfTwoDatesInTime (currentDate,toDate){
  let hours = toDate.diff(currentDate,'hour');
  currentDate =  currentDate.add(hours, 'hour');
  let minutes = toDate.diff(currentDate,'minute');
  currentDate =  currentDate.add(minutes, 'minute');
  let seconds = toDate.diff(currentDate,'second');
  currentDate =  currentDate.add(seconds, 'second');
  if (hours){
    return `${hours} hour, ${minutes} minute and ${seconds} second`; 
  }
  return `${minutes} minute and ${seconds} second`; 
}

/**
 * getSelectObject : to return a object of select from string, array
 * @param {string || array || object} select : selection attributes
 * @returns {object} : object of select to be passed with filter
 */
function getSelectObject (select) {
  let selectArray = [];
  if (typeof select === 'string'){
    selectArray = select.split(' ');
  } else if (Array.isArray(select)){
    selectArray = select;
  } else if (typeof select === 'object'){
    return select;
  }
  let selectObject = {};
  if (selectArray.length){
    for (let index = 0; index < selectArray.length; index += 1) {
      const element = selectArray[index];
      if (element.startsWith('-')){
        Object.assign(selectObject, { [element.substring(1)]: -1 });
      } else {
        Object.assign(selectObject, { [element]: 1 });
      }
    }
  }
  return selectObject;
}

/**
 * checkUniqueFieldsInDatabase: check unique fields in database for insert or update operation.
 * @param {Object} model : mongoose model instance of collection
 * @param {Array} fieldsToCheck : array of fields to check in database.
 * @param {Object} data : data to insert or update.
 * @param {String} operation : operation identification.
 * @param {Object} filter : filter for query.
 * @return {Object} : information about duplicate fields.
 */
const checkUniqueFieldsInDatabase = async (model, fieldsToCheck, data, operation, filter = {})=> {
  switch (operation) {
  case 'INSERT':
    for (const field of fieldsToCheck) {
      //Add unique field and it's value in filter.
      let query = {
        ...filter,
        [field] : data[field] 
      };
      let found = await dbService.findOne(model, query);
      if (found) {
        return {
          isDuplicate : true,
          field: field,
          value:  data[field]
        };
      }
    }
    break;
  case 'UPDATE':  
  default:
    return { isDuplicate : false };
    break;
  }
  return { isDuplicate : false };
};

module.exports = {
  convertObjectToEnum,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getSelectObject,
  checkUniqueFieldsInDatabase
};
