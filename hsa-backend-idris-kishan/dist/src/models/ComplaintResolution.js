'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrementReworked = require('mongoose-auto-increment-reworked');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var complaintResolutionSchema = new Schema({
    _id: { type: String },
    complaintId: { type: String, required: [true, 'ComplaintId is required'], unique: true },
    adminId: { type: String, required: [true, 'Admin ID is required'], unique: true },
    message: { type: String, required: [true, 'Message is required!'] },
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

complaintResolutionSchema.plugin(_mongooseAutoIncrementReworked.MongooseAutoIncrementID.plugin, { modelName: 'ComplaintResolution' });

var ComplaintResolution = _mongoose2.default.model('ComplaintResolution', complaintResolutionSchema);

exports.default = ComplaintResolution;