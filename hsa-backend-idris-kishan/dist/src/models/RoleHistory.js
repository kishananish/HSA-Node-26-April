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
    access_level: [{
        _id: { type: String, 'default': _shortid2.default.generate },
        name: { type: String, required: [true, 'Name is required!'] },
        actions: {
            add: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            view: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
            payment: { type: Boolean, default: false }
        }
    }],
    active: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date
});

var roleHistorySchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
    },
    role_id: {
        type: String,
        ref: 'Role',
        required: [true, 'Role reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
});

var RoleHistory = _mongoose2.default.model('RoleHistory', roleHistorySchema);

exports.default = RoleHistory;