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

var materialSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    name: { type: String, required: [true, 'Name is required!'] },
    price: { type: String, required: [true, 'Price is required!'] },
    isDeleted: { type: Boolean, default: false },
    service_provider_id: {
        type: String,
        ref: 'User',
        required: [true, 'User reference is required!']
    },
    material_category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    },
    material_sub_category_id: {
        type: String,
        ref: 'SubCategory',
        required: [true, 'SubCategory reference is required!']
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Material = _mongoose2.default.model('material', materialSchema);

exports.default = Material;