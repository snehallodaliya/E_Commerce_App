// for create one as well as create many
const create = (model, data) => new Promise((resolve, reject) => {
  model.create(data, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// update single document that will return updated document
const updateOne = (model, filter, data, options = { new: true }) => new Promise((resolve, reject) => {
  model.findOneAndUpdate(filter, data, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// delete single document that will return updated document
const deleteOne = (model, filter, options = { new: true }) => new Promise((resolve, reject) => {
  model.findOneAndDelete(filter, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// find single document by query
const findOne = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.findOne(filter, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// find multiple documents
const findMany = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.find(filter, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// count documents
const count = (model, filter) => new Promise((resolve, reject) => {
  model.countDocuments(filter, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

// find documents with pagination
const paginate = (model, filter, options) => new Promise((resolve, reject) => {
  model.paginate(filter, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

module.exports = {
  create,
  updateOne,
  deleteOne,
  findOne,
  findMany,
  count,
  paginate
};