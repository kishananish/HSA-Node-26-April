'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrementReworked = require('mongoose-auto-increment-reworked');

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var newSchema = new Schema({
    _id: { type: String },
    request_id: { type: String },
    user_id: { type: String },
    complaint_msg: { type: String },
    status: { type: String },
    created_at: Date,
    updated_at: Date
});

var complaintHistorySchema = new Schema({
    _id: { type: String },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: _operationConfig2.default.operationsAllowed
    },
    complaint_id: {
        type: String,
        ref: 'Complaint',
        required: [true, 'Complaint reference is required!']
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

complaintHistorySchema.plugin(_mongooseAutoIncrementReworked.MongooseAutoIncrementID.plugin, { modelName: 'ComplaintHistory' });

var ComplaintHistory = _mongoose2.default.model('ComplaintHistory', complaintHistorySchema);

exports.default = ComplaintHistory;