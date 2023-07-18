import { NextFunction, Request, Response } from "express"
import { SystemError } from "../errors"
import { isDevelopment, isProduction } from "../utils/config"
import joi from "../utils/joi"

export default class ResponseMiddleware {
	static errorHandler = (
		error: SystemError,
		req: Request,
		res: Response,
		next: NextFunction
	): Response => {
		const errorCode = error.code || 500
		let errorMessage: SystemError | object

		if (!isProduction) errorMessage = error
		if (isDevelopment) console.log(error)

		if (error instanceof joi.ValidationError)
			return res.status(400).json({
				message: "Validation error",
				error: error.details.map((detail) => {
					return detail.message
				}),
			})

		if (errorCode === 500 && isProduction)
			return res.status(500).json({
				message: "Something unexpected occurred.",
			})

		if (error.getClient === "web") return res.status(errorCode).send(error.message)

		return res.status(errorCode).json({
			message: error.message,
			error: {
				...(error.errors && { error: error.errors }),
				...(!isProduction && { trace: errorMessage }),
			},
		})
	}
}
