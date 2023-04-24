'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import config from '../../config/operationConfig';

const Schema = mongoose.Schema;

const newSchema = new Schema({
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
    created_at: Date,
    updated_at: Date
});

const roleHistorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    operation: {
        type: String,
        required: [true, 'Operation is not specified!'],
        enum: config.operationsAllowed
    },
    role_id: {
        type: String,
        ref: 'Role',
        required: [true, 'Role reference is required!']
    },
    operator: {
        type: String,
        ref: 'User',
        required: true
    },
    prevObj: newSchema,
    updatedObj: newSchema,
    operation_date: Date
});

const RoleHistory = mongoose.model('RoleHistory', roleHistorySchema);

export default RoleHistory;
