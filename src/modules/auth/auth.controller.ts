import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import UserService from '../user/user.service';

export default class AuthController {
	static async signup(req: Request, res: Response, next: NextFunction) {
		try {
			const userData = req.body;

			const user = await UserService.createUser(userData);
			res.status(200).json({
				message: 'Activation email sent',
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const loginData = req.body;
			const user = await AuthService.login(loginData);

			return res.status(200).json({
				message: 'Login successful',
				data: user,
			});
		} catch (error) {
			next(error);
		}
	}

	static async me(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				user: { _id },
			} = req;
			const profile = await UserService.getUserProfile(_id);

			return res.status(200).json({
				message: 'Profile retrieved',
				data: profile,
			});
		} catch (error) {
			next(error);
		}
	}

	static async activateEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const { activationToken } = req.params;
			const user = await AuthService.activateUser(activationToken);
			if (user) return res.status(200).send('Email verified successfully');
		} catch (error) {
			next(error);
		}
	}
}
