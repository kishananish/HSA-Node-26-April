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

var faqSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    title: { type: String, required: [true, 'Title is required!'], unique: true },
    ar_title: { type: String, required: [true, 'Arabic Title is required!'], unique: true },
    description: { type: String, required: [true, 'Description is required!'] },
    ar_description: { type: String, required: [true, 'Arabic Description is required!'], unique: true },
    category: { type: String, required: [true, 'Category is required!'] },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

var FAQ = _mongoose2.default.model('FAQ', faqSchema);

exports.default = FAQ;