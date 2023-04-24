'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const ServiceActivitySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    service_id: {
        type: String,
        ref: 'Service',
        required: [true, 'Service reference is required!']
    },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    },
    sub_category_id: {
        type: String,
        ref: 'SubCategory',
        required: [true, 'SubCategory reference is required!']
    },
    customer_id: {
        type: String,
        ref: 'Customer',
        required: [true, 'Customer reference is required!']
    },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    progress: { type: String, enum: ['queue', 'assigned', 'reschedule_inprogress', 'new', 'cancel', 'accepted', 'rejected', 'paid', 'journey_cancelled', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'location_reached', 'task_done', 'payment_done', 'review', 'no_response', 'rescheduled'] }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

const ServiceActivity = mongoose.model('ServiceActivity', ServiceActivitySchema);

export default ServiceActivity;
