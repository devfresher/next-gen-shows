import joi from 'joi';
import { isValidObjectId } from 'mongoose';
export { ValidationResult } from 'joi';

export const options = {
	errors: {
		wrap: {
			label: '',
		},
	},
	abortEarly: false,
};

const extendedJoi: joi.Root = joi.extend((joi) => ({
	type: 'objectId',
	base: joi.string(),
	messages: {
		'objectId.invalid': '{{#label}} must be a valid {{#label}} Id',
	},
	validate(value, helpers) {
		if (!isValidObjectId(value)) {
			return { value, errors: helpers.error('objectId.invalid') };
		}
	},
}));

export default extendedJoi;
