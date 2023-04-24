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

var subCategorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    name: { type: String, required: [true, 'Name is required!'], unique: true },
    ar_name: { type: String, required: [true, 'Arabic name is required!'], unique: true },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var SubCategory = _mongoose2.default.model('SubCategory', subCategorySchema);

exports.default = SubCategory;