import { NextFunction, Request, Response } from "express"
import UserService from "./user.service"
import { CustomRequest } from "../../types/general"

export default class UserController {
	static async onboarding(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id.toString()
			const updateData = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				stageName: req.body.stageName,
				talent: req.body.talent,
				reason: req.body.reason,
				portfolio: req.body.portfolio,
			}
			const user = await UserService.updateUser(userId, updateData)

			return res.status(200).json({
				message: "Profile update successful",
				data: user,
			})
		} catch (error) {
			next(error)
		}
	}
}
