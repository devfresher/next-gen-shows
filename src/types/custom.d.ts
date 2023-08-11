import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			fileValidationError?: string;
			user: { _id: string; isAdmin?: boolean };
		}
	}
}

type CustomJwtPayload = JwtPayload & {
	_id: string;
	isAdmin: boolean;
};
