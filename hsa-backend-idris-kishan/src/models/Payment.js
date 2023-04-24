'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
	_id: { type: String, 'default': shortid.generate },
	service_id: {
		type: String,
		ref: 'Service',
		required: [true, 'Service reference is required!']
	},
	user_id: {
		type: String,
		ref: 'Customer',
		required: [true, 'Customer reference is required!']
	},
	service_provider_id: {
		type: String,
		ref: 'User',
		required: [true, 'User reference is required!']
	},
	payment_mode: { type: String, enum: ['cash', 'card'] },
	// card_number: { type: String },
	// expiry: { type: String },
	// cvv: { type: String },
	total_cost: { type: Number },
	total_amount_paid: { type: Number },
	total_amount_pending: { type: Number },
	payfort_response: {},
	payfort_token:{type:String},
	payment_status:{type:Boolean, default:false},
	used_credits:{type:Number, default:0},
	promocode_id: {
        type: String,
        ref: 'Promocode'
    }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
