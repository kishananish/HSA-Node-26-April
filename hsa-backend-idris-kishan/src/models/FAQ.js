'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const faqSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    title: { type: String, required: [true, 'Title is required!'], unique: true },
    ar_title: { type: String, required: [true, 'Arabic Title is required!'], unique: true },
    description: { type: String, required: [true, 'Description is required!'] },
    ar_description: { type: String, required: [true, 'Arabic Description is required!'], unique: true },
    category: { type: String, required: [true, 'Category is required!'] },
    created_at: Date,
    updated_at: Date
},
{
    versionKey: false
});

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
