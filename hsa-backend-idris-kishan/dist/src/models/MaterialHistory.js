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
    price: { type: String, required: [true, 'Price is required!'] },
    isDeleted: { type: Boolean, default: false },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    created_at: Date,
    updated_at: Date
});

var materialHistorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
    },
    material_id: {
        type: String,
        ref: 'Material',
        required: [true, 'Material reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
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
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
});

var MaterialHistory = _mongoose2.default.model('MaterialHistory', materialHistorySchema);

exports.default = MaterialHistory;