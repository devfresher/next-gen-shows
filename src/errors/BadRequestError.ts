import SystemError from "./SystemError"

export default class BadRequestError extends SystemError {
	constructor(message?: string, client?: "web" | "api") {
		super(400, message || "Bad Request", [], client)
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
