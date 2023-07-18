import SystemError from "./SystemError"

export default class ConflictError extends SystemError {
	constructor(message: string) {
		super(409, message)
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
