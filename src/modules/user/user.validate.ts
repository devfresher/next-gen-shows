import { Request } from "express"
import Joi, { ValidationResult, options } from "../../utils/joi"

export default class UserValidator {
	static onboarding(req: Request): ValidationResult {
		const validationSchema = Joi.object({
			firstName: Joi.string().required().trim().label("First Name"),
			lastName: Joi.string().required().trim().label("Last Name"),
			stageName: Joi.string().required().trim().label("Stage Name"),
			reason: Joi.string()
				.required()
				.trim()
				.label("Reason for Joining")
				.valid(...["To build career", "Get recognition", "Get endorsement", "Other"]),
			talent: Joi.string().required().trim().label("Talent/Skill"),
			portfolio: Joi.string().uri().trim().label("Portfolio"),
		})

		return validationSchema.validate(req.body, options)
	}
}
