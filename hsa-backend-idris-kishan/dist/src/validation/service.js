'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceValidator = {
	service: {
		body: {
			progress: _joi2.default.string().equal('new', 'cancel', 'accepted', 'rejected', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'task_done', 'payment_done', 'rescheduled', 'reschedule_inprogress').required(),
			// quote: Joi.array().items({
			// 	description: Joi.string().required(),
			// 	quantity: Joi.string().required(),
			// 	cost: Joi.string().required()
			// }).required()
			// 	.when('progress', {
			// 		is: 'quote_provided',
			// 		then: Joi.array().items({
			// 			description: Joi.string().required(),
			// 			quantity: Joi.string().required(),
			// 			cost: Joi.string().required()
			// 		})
			// 	}),
			quote: _joi2.default.array().items({
				description: _joi2.default.string().required(),
				quantity: _joi2.default.string().required(),
				cost: _joi2.default.string().required()
			}),
			media: _joi2.default.array().items({
				fileId: _joi2.default.string().required(),
				type: _joi2.default.string().required().equal('after', 'before'),
				file_type: _joi2.default.string().required('photo', 'video')
			}),
			time_required: _joi2.default.string(),
			service_cost: _joi2.default.string(),
			comment: _joi2.default.string(),
			schedule_at: _joi2.default.date(),
			reschedule_at: _joi2.default.date()
		}
	},
	acceptOrRejectServiceQuoteByUser: {
		body: {
			progress: _joi2.default.string().equal('quote_accepted', 'quote_rejected', 'cancel', 'payment_done').required(),
			reason: _joi2.default.string()
		}
	},
	raiseComplainByUser: {
		body: {
			service_id: _joi2.default.string().required(),
			user_complain: _joi2.default.string().required()
		}
	},
	complainResolution: {
		body: {
			service_id: _joi2.default.string().required(),
			complain_resolution: _joi2.default.string().required()
		}
	},
	rejectNewServiceByUser: {
		body: {
			progress: _joi2.default.string().equal('cancel').required()
		}
	}
};

exports.default = serviceValidator;