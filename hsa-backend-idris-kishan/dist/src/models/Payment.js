'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var Schema = _mongoose2.default.Schema;

var paymentSchema = new Schema({
	_id: { type: String, 'default': _shortid2.default.generate },
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
	payfort_token: { type: String },
	payment_status: { type: Boolean, default: false },
	used_credits: { type: Number, default: 0 },
	promocode_id: {
		type: String,
		ref: 'Promocode'
	}
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Payment = _mongoose2.default.model('Payment', paymentSchema);

exports.default = Payment;