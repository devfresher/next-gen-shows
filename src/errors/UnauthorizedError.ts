import SystemError from "./SystemError"

export default class UnauthorizedError extends SystemError {
	constructor(message?: string, client?: "web" | "api") {
		super(401, message || "You are not authorized to access this resource.", [], client)
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
