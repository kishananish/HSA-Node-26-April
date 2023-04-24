import Joi from 'joi';

const materialValidator = {
	material: {
		body: {
			name: Joi.string().required(),
			price: Joi.string().required(),
			material_category_id:Joi.string().required(),
			material_sub_category_id:Joi.string().required(),
		}
	}
};

export default materialValidator;
