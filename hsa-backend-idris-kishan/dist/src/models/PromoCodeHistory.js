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
    _id: { type: String, default: _shortid2.default.generate },
    code: {
        type: String,
        required: [true, 'Promo code is required!']
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
    percentage: {
        type: String
        //required: [true, 'Percentage must be specified!']
    },
    amount: { type: String },
    is_removed: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date
});
/**
 * Populating "operator" -- on multiple collection models
 */
var PromoCodeHistorySchema = new Schema({
    _id: { type: String, default: _shortid2.default.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
    },
    promocode_id: {
        type: String,
        ref: 'promocode',
        required: [true, 'promocode reference is required!']
    },
    operator: {
        type: String,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['User', 'Customer']
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
}, {
    versionKey: false
});

var PromoCodeHistory = _mongoose2.default.model('PromoCodeHistory', PromoCodeHistorySchema);

exports.default = PromoCodeHistory;