'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const Schema = mongoose.Schema;

const configurationSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    range: { type: Number,required:true},
    credits: { type: Number,required:true },

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Configuration = mongoose.model('Configuration', configurationSchema);

export default Configuration;