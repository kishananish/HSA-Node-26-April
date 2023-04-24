'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roleValidator = {
	role: {
		body: {
			name: _joi2.default.string().required(),
			active: _joi2.default.boolean().required(),
			access_level: _joi2.default.array().items({
				name: _joi2.default.string().required(),
				actions: _joi2.default.object().keys({
					add: _joi2.default.boolean().required(),
					edit: _joi2.default.boolean().required(),
					view: _joi2.default.boolean().required(),
					delete: _joi2.default.boolean().required(),
					payment: _joi2.default.boolean().required()
				}).required()
			}).required()
		}
	}
};

exports.default = roleValidator;