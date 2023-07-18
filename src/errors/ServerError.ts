import SystemError from "./SystemError"

export default class ServerError extends SystemError {
	constructor(errors?: Array<any>) {
		super(500, "Something went wrong", errors)
		Object.setPrototypeOf(this, new.target.prototype)
	}
}
