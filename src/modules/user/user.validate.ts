import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class UserValidator {
	static onboarding(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			firstName: Joi.string().required().trim().label('First Name'),
			lastName: Joi.string().required().trim().label('Last Name'),
			stageName: Joi.string().required().trim().label('Stage Name'),
			reason: Joi.string()
				.required()
				.trim()
				.label('Reason for Joining')
				.valid(...['To build career', 'Get recognition', 'Get endorsement', 'Others']),
			talentId: Joi.string().required().trim().label('Talent/Skill'),
			countryId: Joi.string().trim().required().label('Country'),
			portfolio: Joi.string().uri().trim().label('Portfolio'),
			city: Joi.string().trim().required().label('State/City'),
		});

		return validationSchema.validate(req.body, options);
	}

	static updateProfile(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			firstName: Joi.string().trim().label('First Name'),
			lastName: Joi.string().trim().label('Last Name'),
			stageName: Joi.string().trim().label('Stage Name'),
			phoneNumber: Joi.string()
				.regex(/^(\+?234|0)[\d]{10}$/)
				.trim()
				.label('Phone Number')
				.messages({
					'string.pattern.base': 'Invalid phone number',
				}),
			profileImage: Joi.object({
				imageId: Joi.string().trim().label('Image ID'),
				url: Joi.string().uri().trim().label('URL'),
			}).label('Profile Image'),
		});

		return validationSchema.validate(req.body, options);
	}
}
