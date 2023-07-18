export default class SystemError extends Error {
	private _code?: number

	private _errors?: Array<any>

	private _client?: "web" | "api"

	get code(): number | undefined {
		return this._code
	}

	get errors(): Array<any> | undefined {
		return this._errors
	}

	get getClient(): "web" | "api" | undefined {
		return this._client
	}

	constructor(
		code: number,
		message: string = "an error occurred",
		errors?: Array<any>,
		client: "api" | "web" = "api"
	) {
		super(message)
		this._code = code || 500
		this._client = client
		this.message = message
		this._errors = errors
		Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
	}
}
