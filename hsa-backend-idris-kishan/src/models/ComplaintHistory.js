'use strict';

import mongoose from 'mongoose';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
    _id: { type: String },
    request_id: { type: String },
    user_id: { type: String },
    complaint_msg:{type:String},
    status:{type:String},
    created_at: Date,
    updated_at: Date
});

const complaintHistorySchema = new Schema({
    _id: { type: String },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
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
},
{
    versionKey: false
});

complaintHistorySchema.plugin(MongooseAutoIncrementID.plugin, {modelName: 'ComplaintHistory'});

const ComplaintHistory = mongoose.model('ComplaintHistory', complaintHistorySchema);

export default ComplaintHistory;
