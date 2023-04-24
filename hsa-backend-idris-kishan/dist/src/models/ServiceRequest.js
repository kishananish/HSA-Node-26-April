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

var serviceRequestSchema = new Schema({
    _id: { type: String, default: _shortid2.default.generate },
    address: {
        type: String,
        coordinates: [Number],
        required: [true, 'Address is required!']
    },
    description: { type: String, required: [true, 'Description is required!'] },
    photos: [String],
    video: [String],
    promoCode: String,
    requester: {
        type: String,
        ref: 'User',
        required: true
    },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

// serviceRequestSchema.index({ "address": "2dsphere" });

var ServiceRequest = _mongoose2.default.model('ServiceRequest', serviceRequestSchema);

exports.default = ServiceRequest;