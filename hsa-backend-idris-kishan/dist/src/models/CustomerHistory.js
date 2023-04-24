'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


var Schema = _mongoose2.default.Schema;

var _addresses = new _mongoose2.default.Schema({
  _id: { type: String, default: _shortid2.default.generate },
  type: { type: String, enum: ['home', 'office'] },
  address: { type: String },
  city: { type: String },
  mapAddress: { type: String },
  zipcode: { type: String },
  country: { type: String },
  isDefault: { type: Boolean, default: false },
  location: {
    coordinates: [],
    type: { type: String, enum: ['Point'] }
  }
});

var newSchema = new _mongoose2.default.Schema({
  _id: { type: String, default: _shortid2.default.generate },
  first_name: { type: String },
  last_name: { type: String },
  email: {
    type: String,
    // unique: true,
    lowercase: true,
    validate: {
      validator: function validator(k) {
        return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(k)
        );
      }
    },
    message: '{VALUE} is not valid email'
  },
  password: { type: String, select: false },
  country_code: { type: String },
  google_id: { type: String },
  facebook_id: { type: String },
  mobile_no: { type: String },
  role: [{ type: String, ref: 'Role' }],
  country: { type: String },
  city: { type: String },
  preferred_language: { type: String, default: 'en' },
  addresses: [_addresses],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  active: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  device_id: { type: String },
  profile_pic: { type: String },
  dateOfJoining: Date,
  credits: Number,
  rating: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

var customerHistorySchema = new Schema({
  _id: { type: String, default: _shortid2.default.generate },
  operation: {
    type: String,
    required: [true, 'Operation is not specified!'],
    enum: _operationConfig2.default.operationsAllowed
  },
  customer_id: {
    type: String,
    ref: 'Customer',
    required: [true, 'Customer reference is required!']
  },
  operator: {
    type: String,
    ref: 'User',
    required: true
  },
  prevObj: newSchema,
  updatedObj: newSchema,
  operation_date: Date
});

var CustomerHistory = _mongoose2.default.model('CustomerHistory', customerHistorySchema);

exports.default = CustomerHistory;