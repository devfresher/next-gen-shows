import { NextFunction, Request, Response } from 'express';
import UserService from './user.service';
import { UpdateUserInput } from '../../types/user';

export default class UserController {
	static async onboarding(req: Request, res: Response, next: NextFunction) {
		try {
			const { body: data } = req;
			const userId = req.user._id.toString();

			const user = await (
				await UserService.onboardParticipant(userId, data)
			).populate(['country', 'talent']);

			return res.status(200).json({
				message: 'Profile update successful',
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id.toString();
			const updateData: UpdateUserInput = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				stageName: req.body.stageName,
				country: req.body.countryId,
				city: req.body.city,
				profileImage: req.body.profileImage,
				talent: req.body.talentId,
				validId: req.body.validIdUrl,
				idNumber: req.body.idNumber,
			};
			const user = await UserService.updateUser(userId, updateData);

			return res.status(200).json({
				message: 'Profile update successful',
				data: await user.populate(['country', 'talent']),
			});
		} catch (error) {
			next(error);
		}
	}
}
