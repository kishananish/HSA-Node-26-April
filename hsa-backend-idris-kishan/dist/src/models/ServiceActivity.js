'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var Schema = _mongoose2.default.Schema;

var ServiceActivitySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    service_id: {
        type: String,
        ref: 'Service',
        required: [true, 'Service reference is required!']
    },
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
    progress: { type: String, enum: ['queue', 'assigned', 'reschedule_inprogress', 'new', 'cancel', 'accepted', 'rejected', 'paid', 'journey_cancelled', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'location_reached', 'task_done', 'payment_done', 'review', 'no_response', 'rescheduled'] }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var ServiceActivity = _mongoose2.default.model('ServiceActivity', ServiceActivitySchema);

exports.default = ServiceActivity;