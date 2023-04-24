import Joi from 'joi';

const customerValidator = {
  facebookLogin: {
    body: {
      access_token: Joi.string(),
      device_id: Joi.string(),
      device_type: Joi.string(),
    },
  },
  googleLogin: {
    body: {
      access_token: Joi.string().required(),
      device_id: Joi.string(),
      device_type: Joi.string(),
    },
  },
  appleLoginCheck: {
    body: {
      user: Joi.string().required(),
    },
  },
  sendOtp: {
    body: {
      country_code: Joi.string().required(),
      mobile_no: Joi.string().required(),
    },
  },
  verifyOtp: {
    body: {
      country_code: Joi.string().required(),
      mobile_no: Joi.string().required(),
      otp: Joi.string().required(),
      email: Joi.string().required(),
    },
  },
  mobileSignup: {
    body: {
      //txnId: Joi.string().required(),
      // country: Joi.string().allow(''),
      city: Joi.string().allow(''),
      first_name: Joi.string(),
      last_name: Joi.string(),
      country_code: Joi.string().required(),
      mobile_no: Joi.string().required(),
      role: Joi.string().required(),
      email: Joi.string().email(),
      // .required(),
      device_id: Joi.string(),
      device_type: Joi.string(),
    },
  },

  serviceMobileSignup: {
    body: {
      //txnId: Joi.string().required(),
      // country: Joi.string().allow(''),
      city: Joi.string().allow(''),
      first_name: Joi.string(),
      last_name: Joi.string(),
      country_code: Joi.string().required(),
      mobile_no: Joi.string().required(),
      email: Joi.string().email(),
      // .required(),
      device_id: Joi.string(),
      device_type: Joi.string(),
    },
  },

  getLatestDeviceId: {
    body: {
      device_id: Joi.string().required(),
    },
  },
  resendVerificationCode: {
    params: {
      id: Joi.number().required(),
    },
  },
  editUser: {
    body: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      city: Joi.string(),
      preferred_language: Joi.string()
        .allow('')
        .optional(),
    },
  },
  socail_verify_contact: {
    body: {
      country_code: Joi.string().required(),
      mobile_no: Joi.string().required(),
      otp: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      device_id: Joi.string().required(),
      device_type: Joi.string().required(),
    },
  },
};

export default customerValidator;
