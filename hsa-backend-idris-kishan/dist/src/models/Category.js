'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var Schema = _mongoose2.default.Schema;

var IMAGE_SERVER_URL = _config2.default.IMAGE_SERVER_URL;

var categorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    name: { type: String, required: [true, 'Name is required!'], unique: true },
    imageName: { type: String },
    ar_name: { type: String, required: [true, 'Arabic name is required!'], unique: true }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

categorySchema.virtual('image_url').get(function () {
    return IMAGE_SERVER_URL + this.imageName;
});

var Category = _mongoose2.default.model('Category', categorySchema);

exports.default = Category;