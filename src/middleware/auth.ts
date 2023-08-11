import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { config } from '../utils/config';
import UserService from '../modules/user/user.service';
import { BadRequestError, ForbiddenError, SystemError, UnauthorizedError } from '../errors';
import { CustomJwtPayload } from '../types/custom';

export default class AuthMiddleware {
	public static async authenticateToken(req: Request, res: Response, next: NextFunction) {
		try {
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.replace(/^Bearer\s+/, '');

			if (!token) throw new BadRequestError('No auth token provided');

			const decodedToken = jwt.verify(token, config.JWT_PRIVATE_KEY) as CustomJwtPayload;
			const user = await UserService.getOne({
				_id: decodedToken._id,
			});

			if (!user) throw new UnauthorizedError('Invalid auth token');

			if (!user.isActive) {
				throw new ForbiddenError(
					'Your account has been deactivated. Please contact support for assistance.'
				);
			}

			req.user = decodedToken;
			return next();
		} catch (error) {
			if (error.name === 'TokenExpiredError')
				error = new UnauthorizedError('Auth token expired');
			if (!(error instanceof SystemError))
				error = new UnauthorizedError('Failed to authenticate token');

			return next(error);
		}
	}

	public static async authenticateAdmin(req: Request, res: Response, next: NextFunction) {
		try {
			await AuthMiddleware.authenticateToken(req, res, (error: any) => {
				if (error) throw error;

				if (!req.user.isAdmin) {
					throw new ForbiddenError('Token valid, but forbidden to take this action');
				}

				return next();
			});
		} catch (error) {
			next(error);
		}
	}
}
