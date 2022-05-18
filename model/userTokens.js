/**
 * userTokens.js
 * @description :: model of a database collection userTokens
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    userId:{
      type:Schema.Types.ObjectId,
      ref:'Users'
    },

    token:{ type:String },

    tokenExpiredTime:{ type:Date },

    isTokenExpired:{
      type:Boolean,
      default:false
    },

    isActive:{ type:Boolean },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'Users'
    },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'Users'
    },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    isDeleted:{ type:Boolean }
  }
  ,{ 
    timestamps: { 
      createdAt: 'createdAt', 
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const userTokens = mongoose.model('userTokens',schema);
module.exports = userTokens;