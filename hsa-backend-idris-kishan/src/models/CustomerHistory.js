'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const _addresses = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  type: { type: String, enum: ['home', 'office'] },
  address: { type: String },
  city: { type: String },
  mapAddress: { type: String },
  zipcode: { type: String },
  country: { type: String },
  isDefault: { type: Boolean, default: false },
  location: {
    coordinates: [],
    type: { type: String, enum: ['Point'] },
  },
});

const newSchema = new mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  first_name: { type: String },
  last_name: { type: String },
  email: {
    type: String,
    // unique: true,
    lowercase: true,
    validate: {
      validator: (k) => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          k
        );
      },
    },
    message: '{VALUE} is not valid email',
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
  updated_at: { type: Date, default: Date.now },
});

const customerHistorySchema = new Schema({
  _id: { type: String, default: shortid.generate },
  operation: {
    type: String,
    required: [true, 'Operation is not specified!'],
    enum: config.operationsAllowed,
  },
  customer_id: {
    type: String,
    ref: 'Customer',
    required: [true, 'Customer reference is required!'],
  },
  operator: {
    type: String,
    ref: 'User',
    required: true,
  },
  prevObj: newSchema,
  updatedObj: newSchema,
  operation_date: Date,
});

const CustomerHistory = mongoose.model(
  'CustomerHistory',
  customerHistorySchema
);

export default CustomerHistory;
