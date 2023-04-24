'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    title: { type: String, required: [true, 'Title is required!'] },
    description: { type: String, required: [true, 'Description is required!'] },
    created_at: Date,
    updated_at: Date
});

const FAQHistorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    faq_id: {
        type: String,
        ref: 'FAQ',
        required: [true, 'FAQ reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
},
{
    versionKey: false
});

const CategoryHistory = mongoose.model('FAQHistory', FAQHistorySchema);

export default CategoryHistory;
