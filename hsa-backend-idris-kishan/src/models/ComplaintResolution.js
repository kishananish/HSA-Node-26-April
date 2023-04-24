'use strict';

import mongoose from 'mongoose';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';
const Schema = mongoose.Schema;

const complaintResolutionSchema = new Schema({
    _id: { type: String },
    complaintId: { type: String, required: [true, 'ComplaintId is required'], unique: true},
    adminId: { type: String, required: [true, 'Admin ID is required'], unique: true},
    message : { type: String, required: [true, 'Message is required!']},
    created_at: Date,
    updated_at: Date
},
{
    versionKey: false
});

complaintResolutionSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'ComplaintResolution' });

const ComplaintResolution = mongoose.model('ComplaintResolution', complaintResolutionSchema);

export default ComplaintResolution;

