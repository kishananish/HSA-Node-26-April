'use strict';

import mongoose from 'mongoose';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    _id: { type: String },
    request_id: { type: String },
    user_id: { type: String },
    complaint_msg:{type:String},
    status:{type:String},
    created_at: Date,
    updated_at: Date
},
{
    versionKey: false
});


complaintSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Complaint' });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
