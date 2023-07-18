import { Request, Response, NextFunction } from "express"
import _ from "lodash"
import { isValidObjectId } from "mongoose"
import { ValidationResult } from "../utils/joi"
import { BadRequestError } from "../errors"

export default class ValidationMiddleware {
	static validateRequest = (validator: (req: Request) => ValidationResult) => {
		return (req: Request, res: Response, next: NextFunction) => {
			const { error, value } = validator(req)

			if (error) throw error
			req.body = value

			next()
		}
	}

	static convertToReadable(name: string): string {
		const words = name.replace(/([a-z])([A-Z])/g, "$1 $2") // Split joined words by inserting a space before each uppercase letter
		const converted = words.replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
		return converted
	}

	static validateObjectIds = (idNames: string | string[]) => {
		return (req: Request, res: Response, next: NextFunction) => {
			idNames = Array.isArray(idNames) ? idNames : [idNames]
			const invalidId = _.find(idNames, (idName) => !isValidObjectId(req.params[idName]))
			if (invalidId) throw new BadRequestError(`Invalid ${invalidId} passed`)

			next()
		}
	}

	static validateQueryObjectIds = (idNames: string | string[]) => {
		return (req: Request, res: Response, next: NextFunction) => {
			idNames = Array.isArray(idNames) ? idNames : [idNames]
			const invalidId = _.find(idNames, (idName) => !isValidObjectId(req.query[idName]))
			if (invalidId) throw new BadRequestError(`Invalid ${invalidId} passed`)

			next()
		}
	}
}
