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

var cardSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    user_id: {
        type: String,
        ref: 'Customer'
    },
    card_name: { type: String, trim: true },
    bank_name: { type: String, trim: true },
    card_number: {
        type: String,
        trim: true,
        maxlength: 19,
        minlength: 8,
        required: [true, 'Card number is required!']
    },
    expiry_date: { type: String, required: [true, 'Expiry month/year is required!'] },
    // expiry_month: { type: String, required: [true, 'Expiry month is required!'] },
    // expiry_year: { type: String, required: [true, 'Expiry year is required!'] },
    cvv: {
        type: String,
        trim: true,
        minlength: 3,
        required: [true, 'CVV is invalid!']
    },
    is_default: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Card = _mongoose2.default.model('Card', cardSchema);

exports.default = Card;