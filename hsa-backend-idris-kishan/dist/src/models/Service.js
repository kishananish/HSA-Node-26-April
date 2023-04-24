'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid-36');

var _shortid2 = _interopRequireDefault(_shortid);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMAGE_SERVER_URL = _config2.default.IMAGE_SERVER_URL;
//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyz_-ABCDEFGHIJKLMNOPQRSTUVWXYZ');


var Schema = _mongoose2.default.Schema;

var serviceSchema = new Schema({
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
        required: [true, 'Customer reference is required!']
    },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    progress: { type: String, enum: ['queue', 'assigned', 'new', 'cancel', 'accepted', 'rejected', 'journey_cancelled', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'location_reached', 'paid', 'task_done', 'payment_done', 'customer_review', 'provider_review', 'no_response', 'rescheduled', 'reschedule_inprogress'] },
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
    payment_status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
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
    comment: String,
    user_complain: String,
    user_complain_date: Date,
    complain_resolution: String,
    complain_resolution_date: Date,
    requested_at: { type: Date, default: Date.now },
    schedule_at: { type: Date },
    is_future_request_fired: { type: Boolean, default: true }, // flag to verify if future-dated requests are sent or not
    reschedule_at: { type: Date },
    isRescheduled: { type: Boolean, default: false },
    respond_at: { type: Date },
    expired_at: { type: Date, default: Date.now },
    progress_at: { type: Date, default: Date.now },
    notified_providers: { type: Array },
    cancellation_commment_by_user: { type: String, default: '' },
    cancellation_commment_by_provider: { type: String, default: '' },
    quote_rejection_comment_by_user: { type: String, default: '' },
    isPromoApplied: { type: Boolean, default: false },
    promo_amount: { type: Number, default: 0 },
    promo_percentage: { type: Number, default: 0 },
    payfortToken: { type: String },
    total_service_charge: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

/**
 * Virtual fields are the additional fields for the given model. 
 * Their values can be set manually or automatically with defined functionality
 * Keep in mind: virtual properties dont get persisted in the database. 
 * They only exist logically and are not written to the document's collection. 
 */
serviceSchema.path('media').schema.virtual('image_url').get(function () {
    return IMAGE_SERVER_URL + this.fileId;
});

var Service = _mongoose2.default.model('Service', serviceSchema);

exports.default = Service;