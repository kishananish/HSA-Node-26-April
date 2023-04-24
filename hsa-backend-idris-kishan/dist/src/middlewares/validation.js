'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    stripUnknown: true,
    // return all errors a payload contains, not just the first one Joi finds
    abortEarly: false
};

var validate = function validate(schema) {

    return function (req, res, next) {
        var toValidate = {};
        if (!schema) {
            return next();
        }

        ['params', 'body', 'query'].forEach(function (key) {
            if (schema[key]) {
                toValidate[key] = req[key];
            }
        });

        var onValidationComplete = function onValidationComplete(err, validated) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: 'Validation errors!',
                    errors: err.details
                });
            }
            // copy the validated data to the req object
            (0, _extend2.default)(req, validated);
            return next();
        };
        return _joi2.default.validate(toValidate, schema, options, onValidationComplete);
    };
};

exports.default = validate;