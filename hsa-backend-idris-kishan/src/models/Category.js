'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
import config from '../../config/config';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const Schema = mongoose.Schema;

const IMAGE_SERVER_URL = config.IMAGE_SERVER_URL;

const categorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'], unique: true },
    imageName: { type: String },
    ar_name: { type: String, required: [true, 'Arabic name is required!'], unique: true },

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

categorySchema.virtual('image_url').get(function () {
    return IMAGE_SERVER_URL + this.imageName;
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
