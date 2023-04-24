'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userValidator = {
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
      otp: _joi2.default.string().required()
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
  addAddress: {
    body: {
      addresses: _joi2.default.array().items({
        type: _joi2.default.string().equal('home', 'office').required(),
        address: _joi2.default.string().required(),
        city: _joi2.default.string().required(),
        zipcode: _joi2.default.string().required(),
        country: _joi2.default.string().required(),
        isDefault: _joi2.default.boolean().required(),
        location: _joi2.default.object().keys({
          coordinates: _joi2.default.array(),
          type: _joi2.default.string().equal('Point').required()
        })
      }).required()
    }
  }
};

exports.default = userValidator;