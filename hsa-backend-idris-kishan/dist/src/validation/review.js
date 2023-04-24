'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reviewValidator = {
	giveReviewToProvider: {
		body: {
			service_id: _joi2.default.string().required(),
			service_provider_rating: _joi2.default.number().min(0).max(5).required(),
			service_provider_comment: _joi2.default.string().required()
		},
		headers: {
			access_token: _joi2.default.string().required()
		}

	},
	giveReviewToCustomer: {
		body: {
			service_id: _joi2.default.string().required(),
			user_rating: _joi2.default.number().min(0).max(5).required(),
			user_comment: _joi2.default.string().required()
		},
		headers: {
			access_token: _joi2.default.string().required()
		}
	}
};

exports.default = reviewValidator;