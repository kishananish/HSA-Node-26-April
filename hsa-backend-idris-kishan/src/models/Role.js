'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'] },
    access_level: [{
        _id: { type: String, 'default': shortid.generate },
        name: { type: String, required: [true, 'Name is required!'] },
        actions: {
            add: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            view: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
            payment: { type: Boolean, default: false }
        }
    }],
    active: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;