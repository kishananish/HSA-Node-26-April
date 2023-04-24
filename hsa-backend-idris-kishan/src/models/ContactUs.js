'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    query_by : {
        type: String,
        ref: 'Customer'
    },
    title: { type: String, required: [true, 'Title is required!'] },
    description: { type: String, required: [true, 'Description is required!'] },
    response: { type: String }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;
