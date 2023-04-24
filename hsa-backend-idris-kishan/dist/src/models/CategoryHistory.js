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
    name: { type: String, required: [true, 'Name is required!'] },
    ar_name: { type: String, required: [true, 'Arabic name is required!'] },
    imageName: { type: String },
    created_at: Date,
    updated_at: Date
});

var categoryHistorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
    },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
}, {
    versionKey: false
});

var CategoryHistory = _mongoose2.default.model('CategoryHistory', categoryHistorySchema);

exports.default = CategoryHistory;