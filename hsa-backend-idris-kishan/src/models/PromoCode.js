'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const promoCodeSchema = new mongoose.Schema({
    _id: { type: String, 'default': shortid.generate },
    code: {
        type: String,
        required: [true, 'Promo code is required!'],
        uppercase: true
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
    promo_type: {
        type: String,
        enum: ['percentage', 'amount'],
        default: 'amount'
    },
    percentage: {
        type: String,
    },
    amount: { type: String },
    is_removed: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;
