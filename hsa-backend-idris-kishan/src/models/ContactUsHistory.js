'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    title: { type: String, required: [true, 'Title is required!'] },
    description: { type: String, required: [true, 'Description is required!'] },
    response: { type: String },
    created_at: Date,
    updated_at: Date
});

const contactUsHistorySchema = new Schema({
    _id: { type: String, default: shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    contact_us_id: {
        type: String,
        ref: 'ContactUs',
        required: [true, 'ContactUs reference is required!']
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

const ContactUsHistory = mongoose.model('ContactUsHistory', contactUsHistorySchema);

export default ContactUsHistory;
