'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const materialSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    name: { type: String, required: [true, 'Name is required!'] },
    price: { type: String, required: [true, 'Price is required!'] },
    isDeleted: { type: Boolean, default: false },
    service_provider_id: {
        type: String,
        ref: 'User',
        required: [true, 'User reference is required!']
    },
    material_category_id:{
        type:String,    
        ref:'Category',
        required: [true, 'Category reference is required!']
    },
    material_sub_category_id:{
        type:String,
        ref:'SubCategory',
        required: [true, 'SubCategory reference is required!']
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Material = mongoose.model('material', materialSchema);

export default Material;