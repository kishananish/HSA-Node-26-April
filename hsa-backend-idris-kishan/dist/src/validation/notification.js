'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notificationValidator = {
	notification: {
		body: {
			content: _joi2.default.string().required(),
			user_type: _joi2.default.string(),
			user_id: _joi2.default.array()
		}
	}
};

exports.default = notificationValidator;