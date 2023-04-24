'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
import config from '../../config/operationConfig';

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    code: {
        type: String,
        required: [true, 'Promo code is required!'],
    },
    start_date: {
        type: Date,
        required: [true, 'Start date must be specified!']
    },
    end_date: {
        type: Date,
        required: [true, 'End date must be specified!']
    },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    },
    percentage: {
        type: String,
        //required: [true, 'Percentage must be specified!']
    },
    amount: { type: String },
    is_removed: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date
});
/**
 * Populating "operator" -- on multiple collection models
 */
const PromoCodeHistorySchema = new Schema({
    _id: { type: String, default: shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    promocode_id: {
        type: String,
        ref: 'promocode',
        required: [true, 'promocode reference is required!']
    },
    operator: {
        type: String,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['User', 'Customer']
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
},
    {
        versionKey: false
    });

const PromoCodeHistory = mongoose.model('PromoCodeHistory', PromoCodeHistorySchema);

export default PromoCodeHistory;
