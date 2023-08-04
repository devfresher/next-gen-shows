import { Document } from 'mongoose';
import { Event } from './event';
import { User, Voter } from './user';

export interface Voting extends Document {
	voter: Voter;
	event: Event;
	participant: User;
	votes: number;
	paymentRef: string;
	createdAt: Date;
}

export interface MetaData {
	voter: Voter;
	votes: number;
	event: string;
	participant: string;
}
