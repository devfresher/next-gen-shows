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
			talentId: Joi.objectId().trim().required().label('Talent/Skill'),
			countryId: Joi.objectId().trim().required().label('Country'),
			validIdUrl: Joi.string().trim().required().label('Valid Id'),
			idNumber: Joi.string().trim().required().label('ID Number'),
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
			phoneNumber: Joi.string().trim().label('Phone Number'),
			profileImage: Joi.object({
				imageId: Joi.string().trim().label('Image ID'),
				url: Joi.string().uri().trim().label('URL'),
			}).label('Profile Image'),
			city: Joi.string().trim().label('State/City'),
			countryId: Joi.objectId().trim().label('Country'),
			validIdUrl: Joi.string().trim().label('Valid Id'),
			idNumber: Joi.string().trim().label('ID Number'),
			talentId: Joi.objectId().trim().label('Talent/Skill'),
		});

		return validationSchema.validate(req.body, options);
	}
}
