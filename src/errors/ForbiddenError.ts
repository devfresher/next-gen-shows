import SystemError from "./SystemError"

export default class ForbiddenError extends SystemError {
	constructor(message?: string) {
		super(403, message || "Access Denied")
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
