import Joi from 'joi';

const reviewValidator = {
	giveReviewToProvider: {
		body: {
			service_id: Joi.string().required(),
			service_provider_rating: Joi.number().min(0).max(5).required(),
			service_provider_comment: Joi.string().required(),
		},
		headers: {
			access_token: Joi.string().required()
		},

	},
	giveReviewToCustomer: {
		body: {
			service_id: Joi.string().required(),
			user_rating: Joi.number().min(0).max(5).required(),
			user_comment: Joi.string().required(),
		},
		headers: {
			access_token: Joi.string().required()
		}
	}
};

export default reviewValidator;
