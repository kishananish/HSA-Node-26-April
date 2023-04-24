import Joi from 'joi';
import Extend from 'extend';

const options = {
    // return an error if body has an unrecognised property
    allowUnknown: false,
    stripUnknown: true,
    // return all errors a payload contains, not just the first one Joi finds
    abortEarly: false
};

const validate = (schema) => {

    return (req, res, next) => {
        let toValidate = {};
        if (!schema) {
            return next();
        }

        ['params', 'body', 'query'].forEach((key) => {
            if (schema[key]) {
                toValidate[key] = req[key];
            }
        });

        const onValidationComplete = (err, validated) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: 'Validation errors!',
                    errors: err.details
                });
            }
            // copy the validated data to the req object
            Extend(req, validated);
            return next();
        };
        return Joi.validate(toValidate, schema, options, onValidationComplete);
    };
};

export default validate;