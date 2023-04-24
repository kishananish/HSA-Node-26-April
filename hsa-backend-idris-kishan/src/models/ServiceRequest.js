'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    address: {
        type: String,
        coordinates: [Number],
        required: [true, 'Address is required!']
    },
    description: { type: String, required: [true, 'Description is required!'] },
    photos: [String],
    video: [String],
    promoCode: String,
    requester: {
        type: String,
        ref: 'User',
        required: true
    },
    created_at: Date,
    updated_at: Date
},
{
    versionKey: false
});

// serviceRequestSchema.index({ "address": "2dsphere" });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
