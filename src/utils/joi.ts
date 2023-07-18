import joi from "joi"
import { isValidObjectId } from "mongoose"

export const objectIdValidator = (value: string, helpers: joi.CustomHelpers<any>) => {
	if (!isValidObjectId(value)) {
		return helpers.error("any.invalid")
	}
	return value
}

export const options = {
	errors: {
		wrap: {
			label: "",
		},
	},
	abortEarly: false,
}

export { ValidationResult } from "joi"
export default joi
