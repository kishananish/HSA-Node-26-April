'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customerValidator = {
  facebookLogin: {
    body: {
      access_token: _joi2.default.string(),
      device_id: _joi2.default.string(),
      device_type: _joi2.default.string()
    }
  },
  googleLogin: {
    body: {
      access_token: _joi2.default.string().required(),
      device_id: _joi2.default.string(),
      device_type: _joi2.default.string()
    }
  },
  appleLoginCheck: {
    body: {
      user: _joi2.default.string().required()
    }
  },
  sendOtp: {
    body: {
      country_code: _joi2.default.string().required(),
      mobile_no: _joi2.default.string().required()
    }
  },
  verifyOtp: {
    body: {
      country_code: _joi2.default.string().required(),
      mobile_no: _joi2.default.string().required(),
      otp: _joi2.default.string().required(),
      email: _joi2.default.string().required()
    }
  },
  mobileSignup: {
    body: {
      //txnId: Joi.string().required(),
      // country: Joi.string().allow(''),
      city: _joi2.default.string().allow(''),
      first_name: _joi2.default.string(),
      last_name: _joi2.default.string(),
      country_code: _joi2.default.string().required(),
      mobile_no: _joi2.default.string().required(),
      role: _joi2.default.string().required(),
      email: _joi2.default.string().email(),
      // .required(),
      device_id: _joi2.default.string(),
      device_type: _joi2.default.string()
    }
  },

  serviceMobileSignup: {
    body: {
      //txnId: Joi.string().required(),
      // country: Joi.string().allow(''),
      city: _joi2.default.string().allow(''),
      first_name: _joi2.default.string(),
      last_name: _joi2.default.string(),
      country_code: _joi2.default.string().required(),
      mobile_no: _joi2.default.string().required(),
      email: _joi2.default.string().email(),
      // .required(),
      device_id: _joi2.default.string(),
      device_type: _joi2.default.string()
    }
  },

  getLatestDeviceId: {
    body: {
      device_id: _joi2.default.string().required()
    }
  },
  resendVerificationCode: {
    params: {
      id: _joi2.default.number().required()
    }
  },
  editUser: {
    body: {
      first_name: _joi2.default.string().required(),
      last_name: _joi2.default.string().required(),
      city: _joi2.default.string(),
      preferred_language: _joi2.default.string().allow('').optional()
    }
  },
  socail_verify_contact: {
    body: {
      country_code: _joi2.default.string().required(),
      mobile_no: _joi2.default.string().required(),
      otp: _joi2.default.string().required(),
      email: _joi2.default.string().email().required(),
      device_id: _joi2.default.string().required(),
      device_type: _joi2.default.string().required()
    }
  }
};

exports.default = customerValidator;