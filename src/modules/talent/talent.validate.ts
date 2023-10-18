import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class TalentValidator {
	static newTalent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().required().trim().label('Category Name'),
			description: Joi.string().required().label('Description'),
		});

		return validationSchema.validate(req.body, options);
	}

	static updateTalent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().required().trim().label('Category Name'),
			description: Joi.string().required().label('Description'),
		});

		return validationSchema.validate(req.body, options);
	}
}
