import { Request } from "express"
import Joi, { ValidationResult, options } from "../../utils/joi"

export default class AuthValidator {
	static newParticipant(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			email: Joi.string().email().required().trim().lowercase().label("Email Address"),
			password: Joi.string().min(6).required().trim().label("Password"),
			phoneNumber: Joi.string()
				.regex(/^(\+?234|0)[\d]{10}$/)
				.trim()
				.label("Phone Number")
				.messages({
					"string.pattern.base": "Invalid phone number",
				}),
		})

		return validationSchema.validate(req.body, options)
	}

	static login(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			email: Joi.string().email().required().trim().lowercase().label("Email Address"),
			password: Joi.string().required().trim().label("Password"),
		})

		return validationSchema.validate(req.body, options)
	}
}
