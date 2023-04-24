'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var materialValidator = {
	material: {
		body: {
			name: _joi2.default.string().required(),
			price: _joi2.default.string().required(),
			material_category_id: _joi2.default.string().required(),
			material_sub_category_id: _joi2.default.string().required()
		}
	}
};

exports.default = materialValidator;