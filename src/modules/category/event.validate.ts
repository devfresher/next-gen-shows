import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class CategoryValidator {
	static newCategory(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().required().trim().label('Category Name'),
			description: Joi.string().required().trim().min(5).label('Description'),
			eventId: Joi.number().required().label('Event'),
			talentId: Joi.number().required().label('Talent'),
			countryId: Joi.number().required().label('Country'),
		});

		return validationSchema.validate(req.body, options);
	}

	static updateEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			name: Joi.string().trim().label('Category Name'),
			description: Joi.string().trim().min(5).label('Description'),
			eventId: Joi.number().label('Event'),
			talentId: Joi.number().label('Talent'),
			countryId: Joi.number().label('Country'),
		});

		return validationSchema.validate(req.body, options);
	}
}
