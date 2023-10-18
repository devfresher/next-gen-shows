import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class CategoryValidator {
	static newCategory(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().required().trim().label('Category Name'),
			description: Joi.string().required().trim().min(5).label('Description'),
			eventId: Joi.string().required().label('Event'),
			talentId: Joi.string().required().label('Talent'),
			countryId: Joi.string().required().label('Country'),
		});

		return validationSchema.validate(req.body, options);
	}

	static updateCategory(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().trim().label('Category Name'),
			description: Joi.string().trim().label('Description'),
			eventId: Joi.string().label('Event'),
			talentId: Joi.string().label('Talent'),
			countryId: Joi.string().label('Country'),
		});

		return validationSchema.validate(req.body, options);
	}
}
