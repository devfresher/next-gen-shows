import SystemError from "./SystemError"

export default class NotFoundError extends SystemError {
	constructor(message?: string) {
		super(404, message || "Resource not found.")
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
