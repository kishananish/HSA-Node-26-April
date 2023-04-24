import Joi from 'joi';

const serviceValidator = {
	service: {
		body: {
			progress: Joi.string().equal('new', 'cancel', 'accepted', 'rejected', 'quote_provided', 'quote_accepted', 'quote_rejected', 'leave_for_the_job', 'ongoing', 'task_done', 'payment_done', 'rescheduled', 'reschedule_inprogress').required(),
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
			quote: Joi.array().items({
				description: Joi.string().required(),
				quantity: Joi.string().required(),
				cost: Joi.string().required()
			}),
			media: Joi.array().items({
				fileId: Joi.string().required(),
				type: Joi.string().required().equal('after', 'before'),
				file_type: Joi.string().required('photo', 'video')
			}),
			time_required: Joi.string(),
			service_cost: Joi.string(),
			comment: Joi.string(),
			schedule_at: Joi.date(),
			reschedule_at: Joi.date()
		}
	},
	acceptOrRejectServiceQuoteByUser: {
		body: {
			progress: Joi.string().equal('quote_accepted', 'quote_rejected', 'cancel', 'payment_done').required(),
			reason: Joi.string()
		}
	},
	raiseComplainByUser: {
		body: {
			service_id: Joi.string().required(),
			user_complain: Joi.string().required()
		}
	},
	complainResolution: {
		body: {
			service_id: Joi.string().required(),
			complain_resolution: Joi.string().required()
		}
	},
	rejectNewServiceByUser: {
		body: {
			progress: Joi.string().equal('cancel').required(),
		}
	},
};

export default serviceValidator;
