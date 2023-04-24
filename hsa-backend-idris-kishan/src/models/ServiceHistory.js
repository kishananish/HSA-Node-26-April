'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    },
    sub_category_id: {
        type: String,
        ref: 'SubCategory',
        required: [true, 'SubCategory reference is required!']
    },
    customer_id: {
        type: String,
        ref: 'Customer',
        required: [true, 'User reference is required!']
    },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    progress: { type: String, enum: ['queue', 'new', 'reschedule_inprogress', 'location_reached','cancel', 'accepted', 'rejected', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'task_done', 'payment_done', 'review'] },
    media: [{
        _id: { type: String, 'default': shortid.generate },
        type: { type: String, enum: ['before', 'after'], default: 'before' },
        file_type: { type: String, enum: ['photo', 'video'], default: 'photo' },
        fileId: String
    }],
    payment_id: {
        type: String,
        ref: 'Payment'
    },
    review_id: {
        type: String,
        ref: 'Review'
    },
    description: { type: String },
    latitude: { type: String, required: [true, 'latitude is required!'] },
    longitude: { type: String, required: [true, 'longitude is required!'] },
    quote: [{
        _id: { type: String, 'default': shortid.generate },
        description: String,
        quantity: String,
        cost: String
    }],
    service_cost: String,
    time_required: String,
    address: {
        address: String,
        city: String,
        zipcode: String
    },
    promocode_id: {
        type: String,
        ref: 'Promocode'
    },
    total_service_charge: {
        type: Number,
        default: 0
    },
    requested_at: { type: Date, default: Date.now },
    progress_at: { type: Date, default: Date.now },
    created_at: Date,
    updated_at: Date
});

const serviceHistorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    service_id: {
        type: String,
        ref: 'Service',
        required: [true, 'Service reference is required!']
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

const ServiceHistory = mongoose.model('ServiceHistory', serviceHistorySchema);

export default ServiceHistory;
