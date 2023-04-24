'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const accessLevelSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'], unique: true },
    actions: {
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        view: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        payment: { type: Boolean, default: false }
    },
    created_at: Date,
    updated_at: Date
});

const AccessLevel = mongoose.model('AccessLevel', accessLevelSchema);

export default AccessLevel;
