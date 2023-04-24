'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const locationsSchema = new Schema({
    _id: { type: String, 'default': shortid.generate },
    service_id: {
        type: String,
        ref: 'Service',
        unique: true,
        required: [true, 'Service reference is required!']
    },
    provider_id: {
        type: String,
        ref: 'User'
    },
    customer_id: {
        type: String,
        ref: 'Customer'
    },
    start_location_coordinates: {},
    end_location_coordinates: {},
    current_coordinates: [{
        _id: { type: String, 'default': shortid.generate },
        coordinates: {},
        type: { type: String }
    }]
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

const Locations = mongoose.model('Location', locationsSchema);

export default Locations;