import { Document } from 'mongoose';
import { User } from './user';
import { ID } from './general';
import { Category } from './category';

export interface Participation extends Document {
	user: User;
	category: Category;
	registeredData: object;
	multimedia: { url: string; id: string };
	paymentRef: string;
	createdAt: Date;
	status: Status;
	stage: ValidStage;
}

export interface MetaData {
	userId: ID;
	categoryId: ID;
	registeredData: {
		name: string;
		email: string;
		phoneNumber: string;
		portfolio: string;
	};
	multimedia?: {
		id?: string;
		url?: string;
	};
}

export enum Status {
	shortlisted = 'Shortlisted',
	confirmed = 'Confirmed',
	joined = 'Joined',
}

export type ValidStage = 1 | 2 | 3;
