import Joi from 'joi';

const userValidator = {
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
  addAddress: {
    body: {
      addresses: Joi.array()
        .items({
          type: Joi.string()
            .equal('home', 'office')
            .required(),
          address: Joi.string().required(),
          city: Joi.string().required(),
          zipcode: Joi.string().required(),
          country: Joi.string().required(),
          isDefault: Joi.boolean().required(),
          location: Joi.object().keys({
            coordinates: Joi.array(),
            type: Joi.string()
              .equal('Point')
              .required(),
          }),
        })
        .required(),
    },
  },
};

export default userValidator;
