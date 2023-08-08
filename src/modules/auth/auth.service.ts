import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "../../utils/config"
import { User } from "../../types/user"
import { AuthToken, LoginData } from "../../types/auth"
import UserService from "../user/user.service"
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../errors"
import { CustomJWTPayload } from "../../types/general"
import RedisUtil from "../../utils/RedisUtil"

export default class AuthService {
	static async login(loginData: LoginData) {
		const { email, password } = loginData
		let user = await UserService.getOne({ email }, false)

		if (!user) throw new BadRequestError("Incorrect email or password")

		if (!user.isActive)
			throw new ForbiddenError(
				"Your account has been deactivated. Please contact support for assistance."
			)

		const isValidPassword = await bcrypt.compare(password, user.password)
		if (!isValidPassword) throw new BadRequestError("Incorrect email or password")

		const accessToken = await AuthService.generateAuthToken(user)
		user = await UserService.getOne({ email }, true)

		return { user, accessToken }
	}

	static async activateUser(activationToken: string): Promise<User> {
		if (!activationToken) throw new BadRequestError("No activation token provided", "web")

		const isRevoked = await RedisUtil.isTokenRevoked(activationToken)
		if (isRevoked) throw new UnauthorizedError("You are using a revoked token", "web")

		const decodedToken = jwt.verify(activationToken, config.JWT_PRIVATE_KEY) as CustomJWTPayload
		let user = await UserService.getOne({
			_id: decodedToken._id,
		})
		if (!user) throw new UnauthorizedError("Invalid auth token", "web")

		user = await UserService.updateUser(user._id.toString(), {
			emailVerified: true,
		})
		await RedisUtil.addToRevokedTokens(activationToken)
		return user
	}

	static async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)
		return hashedPassword
	}

	static async generateAuthToken(user: User): Promise<AuthToken> {
		const expiry = 5 * 60 * 1000
		const token = jwt.sign(
			{
				_id: user._id,
				isAdmin: user.isAdmin,
			},
			config.JWT_PRIVATE_KEY,
			{ expiresIn: expiry }
		)
		return { token, expiresAt: new Date(Date.now() + expiry) }
	}
}
