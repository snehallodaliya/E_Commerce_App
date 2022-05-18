/**
 * Users.js
 * @description :: model of a database collection Users
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const bcrypt = require('bcrypt');
const { USER_TYPES } = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');
        
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

    username:{ type:String },

    password:{ type:String },

    name:{ type:String },

    userType:{
      type:Number,
      enum:convertObjectToEnum(USER_TYPES),
      required:true
    },

    isActive:{ type:Boolean },

    isDeleted:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

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
  if (this.password){
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    _id, __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = _id;
  delete object.password;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const Users = mongoose.model('Users',schema);
module.exports = Users;