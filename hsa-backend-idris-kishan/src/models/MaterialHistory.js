'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'] },
    price: { type: String, required: [true, 'Price is required!'] },
    isDeleted: { type: Boolean, default: false },
    service_provider_id: {
        type: String,
        ref: 'User',
    },
    created_at: Date,
    updated_at: Date
});

const materialHistorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    material_id: {
        type: String,
        ref: 'Material',
        required: [true, 'Material reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
    },
    material_category_id:{
        type:String,    
        ref:'Category',
        required: [true, 'Category reference is required!']
    },
    material_sub_category_id:{
        type:String,
        ref:'SubCategory',
        required: [true, 'SubCategory reference is required!']
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
});

const MaterialHistory = mongoose.model('MaterialHistory', materialHistorySchema);

export default MaterialHistory;
