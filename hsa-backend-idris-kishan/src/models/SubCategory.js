'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'], unique: true },
    ar_name: { type: String, required: [true, 'Arabic name is required!'], unique: true },
    category_id: {
        type: String,
        ref: 'Category',
        required: [true, 'Category reference is required!']
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;
