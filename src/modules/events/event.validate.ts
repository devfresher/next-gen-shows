import { Request } from 'express';
import Joi, { ValidationResult, options } from '../../utils/joi';

export default class EventValidator {
	static newEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			eventName: Joi.string().required().trim().label('Event Name'),
			description: Joi.string().required().trim().min(5).label('Description'),
			categories: Joi.string().required().trim().label('Categories'),
			eventCover: Joi.object({
				imageId: Joi.string().required().trim().label('Image ID'),
				url: Joi.string().uri().required().trim().label('URL'),
			}).label('Event Cover'),
			eventVideo: Joi.object({
				videoId: Joi.string().trim().label('Video ID'),
				url: Joi.string().uri().trim().label('URL'),
			}).label('Event Video'),
		});

		return validationSchema.validate(req.body, options);
	}

	static joinEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			useAsOnProfile: Joi.boolean().required().label('Use details as on profile'),
			fullName: Joi.when('useAsOnProfile', {
				is: false,
				then: Joi.string().required().trim().label('Full Name'),
				otherwise: Joi.forbidden(),
			}),
			email: Joi.when('useAsOnProfile', {
				is: false,
				then: Joi.string().email().required().trim().lowercase().label('Email Address'),
				otherwise: Joi.forbidden(),
			}),
			portfolio: Joi.when('useAsOnProfile', {
				is: false,
				then: Joi.string().uri().trim().label('Portfolio'),
				otherwise: Joi.forbidden(),
			}),
			phoneNumber: Joi.when('useAsOnProfile', {
				is: false,
				then: Joi.string()
					.regex(/^(\+?234|0)[\d]{10}$/)
					.trim()
					.required()
					.label('Phone Number')
					.messages({
						'string.pattern.base': 'Invalid phone number',
					}),
				otherwise: Joi.forbidden(),
			}),
			category: Joi.string().trim().required().label('Category'),
			subCategory: Joi.string().trim().label('Sub Category'),
		});

		return validationSchema.validate(req.body, options);
	}

	static vote(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			numberOfVotes: Joi.number().required().label('Number of votes'),
			fullName: Joi.string().trim().label('Full Name'),
			email: Joi.string().email().required().trim().lowercase().label('Email Address'),
			phoneNumber: Joi.string()
				.regex(/^(\+?234|0)[\d]{10}$/)
				.trim()
				.required()
				.label('Phone Number')
				.messages({
					'string.pattern.base': 'Invalid phone number',
				}),
		});

		return validationSchema.validate(req.body, options);
	}

	static updateEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			eventName: Joi.string().trim().label('Event Name'),
			description: Joi.string().trim().min(5).label('Description'),
			categories: Joi.string().trim().label('Categories'),
			eventCover: Joi.object({
				imageId: Joi.string().trim().label('Image ID'),
				url: Joi.string().uri().trim().label('URL'),
			}).label('Event Cover'),
			eventVideo: Joi.object({
				videoId: Joi.string().trim().label('Video ID'),
				url: Joi.string().uri().trim().label('URL'),
			}).label('Event Video'),
		});

		return validationSchema.validate(req.body, options);
	}
}
