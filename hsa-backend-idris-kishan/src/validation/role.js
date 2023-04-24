import Joi from 'joi';

const roleValidator = {
	role: {
		body: {
			name: Joi.string().required(),
			active: Joi.boolean().required(),
			access_level: Joi.array().items({
				name: Joi.string().required(),
				actions: Joi.object().keys({
					add: Joi.boolean().required(),
					edit: Joi.boolean().required(),
					view: Joi.boolean().required(),
					delete: Joi.boolean().required(),
					payment: Joi.boolean().required(),
				}).required(),
			}).required()
		}
	}
};

export default roleValidator;
