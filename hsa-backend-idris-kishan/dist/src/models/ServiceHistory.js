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

var newSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
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
    progress: { type: String, enum: ['queue', 'new', 'reschedule_inprogress', 'location_reached', 'cancel', 'accepted', 'rejected', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'task_done', 'payment_done', 'review'] },
    media: [{
        _id: { type: String, 'default': _shortid2.default.generate },
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
        _id: { type: String, 'default': _shortid2.default.generate },
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

var serviceHistorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
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

var ServiceHistory = _mongoose2.default.model('ServiceHistory', serviceHistorySchema);

exports.default = ServiceHistory;