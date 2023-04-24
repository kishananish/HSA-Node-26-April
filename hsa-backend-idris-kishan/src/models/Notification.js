'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    content: { type: String, required: [true, 'Content is required!'] },
    user_id: [{ type: String, required: true, refPath: 'onModel' }],
    onModel: { type: String, enum: ['User', 'Customer'], required: true },
    user_type: { type: String },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Notifications = mongoose.model('Notification', notificationSchema);

export default Notifications;