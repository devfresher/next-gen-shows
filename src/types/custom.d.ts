import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
	export interface Request {
		fileValidationError?: string;
		user: { _id: string; isAdmin?: boolean };
	}
}

declare module 'joi' {
	export interface Root {
		objectId(): StringSchema;
	}
}

declare module 'jsonwebtoken' {
	export interface JwtPayload {
		_id: string;
		isAdmin: boolean;
	}
}

type CustomJwtPayload = JwtPayload & {
	_id: string;
	isAdmin: boolean;
};
