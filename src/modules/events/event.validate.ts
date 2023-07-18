import { Request } from "express"
import Joi, { ValidationResult, options } from "../../utils/joi"

export default class EventValidator {
	static newEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			eventName: Joi.string().required().trim().label("Event Name"),
			description: Joi.string().required().trim().min(5).label("Description"),
			categories: Joi.string().required().trim().label("Categories"),
		})

		return validationSchema.validate(req.body, options)
	}

	static joinEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			fullName: Joi.string().required().trim().label("Name"),
			email: Joi.string().email().required().trim().lowercase().label("Email Address"),
			portfolio: Joi.string().uri().trim().label("Portfolio"),
			phoneNumber: Joi.string()
				.regex(/^(\+?234|0)[\d]{10}$/)
				.trim()
				.required()
				.label("Phone Number")
				.messages({
					"string.pattern.base": "Invalid phone number",
				}),
			category: Joi.string().trim().required().label("Category"),
			subCategory: Joi.string().trim().label("Sub Category")
		})

		return validationSchema.validate(req.body, options)
	}

	static updateEvent(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			eventName: Joi.string().required().trim().label("Event Name"),
			description: Joi.string().required().trim().min(5).label("Description"),
			categories: Joi.string().required().trim().label("Categories"),
		})

		return validationSchema.validate(req.body, options)
	}
}
