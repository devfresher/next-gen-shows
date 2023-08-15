import { Document, Types } from 'mongoose';
import { Event } from './event';
import { User } from './user';

export interface Participation extends Document {
	user: User;
	event: Event;
	registeredData: object;
	multimedia: { url: string; id: string };
	category: string;
	paymentRef: string;
	createdAt: Date;
}

export interface MetaData {
	user: string;
	event: string;
	registeredData: {
		name: string;
		email: string;
		phoneNumber: string;
		portfolio: string;
	};
	category: string;
	multimedia?: {
		id?: string;
		url?: string;
	};
}
