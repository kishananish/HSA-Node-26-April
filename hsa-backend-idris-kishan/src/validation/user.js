import Joi from 'joi';

const userValidator = {
	facebookLogin: {
		body: {
			access_token: Joi.string().required(),
			device_id: Joi.string(),
			device_type: Joi.string()
		}
	},
	googleLogin: {
		body: {
			access_token: Joi.string().required(),
			device_id: Joi.string(),
			device_type: Joi.string()
		}
	},
	appleLogin: {
		body: {
			user: Joi.string().required(),
			device_id: Joi.string(),
			device_type: Joi.string(),
			identityToken: Joi.string(),
		}
	},
	sendOtp: {
		body: {
			country_code: Joi.string().required(),
			mobile_no: Joi.string().required()
		}
	},
	verifyOtp: {
		body: {
			country_code: Joi.string().required(),
			mobile_no: Joi.string().required(),
			otp: Joi.string().required()
		}
	},
	mobileSignup: {
		body: {
			txnId: Joi.string().required(),
			country: Joi.string().allow(''),
			city: Joi.string().allow(''),
			first_name: Joi.string().min(3).max(30),
			last_name: Joi.string().min(3).max(30),
			email: Joi.string().email().required(),
			role: Joi.string().equal('user', 'service_provider'),
			device_id: Joi.string(),
			device_type: Joi.string()
		}
	},
	resendVerificationCode: {
		params: {
			id: Joi.number().required()
		}
	},
	editUser: {
		body: {
			first_name: Joi.string().required(),
			last_name: Joi.string().required(),
			city: Joi.string(),
			preferred_language: Joi.string().allow('').optional()
		}
	},
	addAddress: {
		body: {
			addresses: Joi.array().items({
				type: Joi.string().equal('home', 'office').required(),
				address: Joi.string().required(),
				city: Joi.string().required(),
				zipcode: Joi.string().required(),
				country: Joi.string().required(),
				isDefault: Joi.boolean().required(),
				location: Joi.object().keys({
					coordinates: Joi.array(),
					type: Joi.string().equal('Point').required()
				})
			}).required()
		}
	}
};

export default userValidator;
