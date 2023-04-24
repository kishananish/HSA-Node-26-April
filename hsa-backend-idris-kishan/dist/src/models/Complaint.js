'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrementReworked = require('mongoose-auto-increment-reworked');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var complaintSchema = new Schema({
    _id: { type: String },
    request_id: { type: String },
    user_id: { type: String },
    complaint_msg: { type: String },
    status: { type: String },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

complaintSchema.plugin(_mongooseAutoIncrementReworked.MongooseAutoIncrementID.plugin, { modelName: 'Complaint' });

var Complaint = _mongoose2.default.model('Complaint', complaintSchema);

exports.default = Complaint;