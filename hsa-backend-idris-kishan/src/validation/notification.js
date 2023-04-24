import Joi from 'joi';

const notificationValidator = {
	notification: {
		body: {
			content: Joi.string().required(),
			user_type: Joi.string(),
			user_id: Joi.array()
		}
	}
};

export default notificationValidator;
