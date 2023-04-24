'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const _addresses = new mongoose.Schema({
    _id: { type: String, 'default': shortid.generate },
    type: { type: String, enum: ['home', 'office'] },
    address: { type: String },
    mapAddress: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    isDefault: { type: Boolean, default: false },
    location: {
        coordinates: [],
        type: { type: String, enum: ['Point'] }
    },
});

const newSchema = new mongoose.Schema({
    _id: { type: String, 'default': shortid.generate },
    first_name: { type: String },
    last_name: { type: String },
    email: {
        type: String,
        // unique: true,
        lowercase: true,
        validate: { validator: (k) => { return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(k); } },
        message: '{VALUE} is not valid email',
    },
    password: { type: String, select: false },
    country_code: { type: String },
    google_id: { type: String },
    facebook_id: { type: String },
    mobile_no: { type: String },
    role: [{ type: String, ref: 'Role', }],
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
    add_material_flag: { type: Boolean, default: true },
    area_assigned: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Must provide its specialized category!']
    },
});

const userHistorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    user_id: {
        type: String,
        ref: 'User',
        required: [true, 'User reference is required!']
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

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

export default UserHistory;
