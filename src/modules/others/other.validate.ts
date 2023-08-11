import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class OtherValidator {
	static contactUs(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			firstName: Joi.string().required().trim().label('First Name'),
			lastName: Joi.string().trim().label('Last Name'),
			emailAddress: Joi.string().email().required().trim().label('Email'),
			message: Joi.string().required().trim().label('Message'),
		});

		return validationSchema.validate(req.body, options);
	}
}
