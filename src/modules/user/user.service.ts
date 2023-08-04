import { FilterQuery } from "../../types/general"
import { CreateUserInput, UpdateUserInput, User } from "../../types/user"
import UserModel from "./user.model"
import AuthService from "../auth/auth.service"
import { ConflictError, NotFoundError } from "../../errors"
import { sendEmail } from "../mailer/EmailService"
import { config } from "../../utils/config"

export default class UserService {
	static model = UserModel

	static async getOne(filterQuery: FilterQuery, sensitive = true): Promise<User | null> {
		const projection = sensitive ? { password: 0, passwordReset: 0 } : {}
		const user = await this.model.findOne(filterQuery, projection)

		return user || null
	}

	static async createUser(userData: CreateUserInput): Promise<User> {
		const { email, password, phoneNumber } = userData

		let user = await this.getOne({ email })
		if (user) throw new ConflictError("Email address already taken")

		let newUser = new this.model({
			email,
			phoneNumber,
			password: await AuthService.hashPassword(password),
		})

		await newUser.save()

		user = await this.getOne({ email })
		const activationToken = await AuthService.generateAuthToken(user)
		const activationLink = `${config.BASE_URL}/activate/${activationToken.token}`
		sendEmail({
			recipientEmail: email,
			templateName: "welcome",
			templateData: {
				user,
				activation: { link: activationLink, expiry: activationToken.expiresAt },
			},
		})
		return user
	}

	static async updateUser(userId: string, userData: UpdateUserInput): Promise<User> {
		const {
			firstName,
			lastName,
			stageName,
			emailVerified,
			phoneNumber,
			portfolio,
			talent,
			reason,
		} = userData

		let user = await this.getOne({ _id: userId })
		if (!user) throw new NotFoundError("User not found")

		await this.model.updateOne(
			{ _id: userId },
			{
				firstName,
				lastName,
				stageName,
				emailVerified,
				phoneNumber,
				portfolio,
				talent,
				reason,
			}
		)
		user = await this.getOne({ _id: userId })
		return user
	}

	public static async profileCompleted(userId: string): Promise<boolean> {
		const user = await this.getOne({ _id: userId })
		if (user?.fullName && user?.email && user?.phoneNumber && user?.portfolio) return true

		return false
	}
}
