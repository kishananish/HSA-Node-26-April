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

var promoCodeSchema = new _mongoose2.default.Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
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
        type: String
    },
    amount: { type: String },
    is_removed: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

var PromoCode = _mongoose2.default.model('PromoCode', promoCodeSchema);

exports.default = PromoCode;