import { Request } from 'express';

declare global {
	namespace Express {
		interface Request {
			fileValidationError?: string;
			user: { _id: string; isAdmin?: boolean };
		}
	}
}
