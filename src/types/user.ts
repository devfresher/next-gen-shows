import { Document, Types } from 'mongoose';
import { ImageFile } from './general';

export interface User extends Document {
	firstName?: string;
	lastName?: string;
	fullName?: string;
	stageName?: string;
	email: string;
	talent?: string;
	portfolio?: string;
	password?: string;
	isActive?: boolean;
	emailVerified?: boolean;
	isAdmin?: boolean;
	phoneNumber?: string;
	passwordReset?: {
		token: string;
		expiry: Date;
	};
	profileImage?: ImageFile;
	createdAt: Date;
}

export interface CreateUserInput {
	email: string;
	password?: string;
	phoneNumber?: string;
	isVoter?: boolean;
	isAdmin?: boolean;
	isParticipant?: boolean;
}

export interface UpdateUserInput {
	firstName?: string;
	lastName?: string;
	stageName?: string;
	talent?: string;
	portfolio?: string;
	password?: string;
	phoneNumber?: string;
	emailVerified?: boolean;
	reason?: string;
	country?: string;
	city?: string;
	isOnboard?: boolean;
	profileImage?: ImageFile;
}

export interface Voter {
	_id?: any;
	fullName?: string;
	email: string;
	phoneNumber?: string;
}

export interface ParticipantWithVotes extends User {
	votes: number;
}
