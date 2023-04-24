'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userValidator = {
	forgotPassword: {
		body: {
			email: _joi2.default.string().email().required()
		}
	},
	resetPassword: {
		params: {
			token: _joi2.default.string().required()
		}
	},
	changePassword: {
		body: {
			old_password: _joi2.default.string().required(),
			new_password: _joi2.default.string().min(3).max(15).required().regex(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/),
			confirm_password: _joi2.default.any().valid(_joi2.default.ref('new_password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
		}
	},
	addUser: {}
};

exports.default = userValidator;