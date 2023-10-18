import { Document } from 'mongoose';
import { Event } from './event';
import { User, Voter } from './user';
import { ID } from './general';
import { Category } from './category';

export interface Voting extends Document {
	voter: Voter;
	category: Category;
	participant: User;
	votes: number;
	paymentRef: string;
	createdAt: Date;
}

export interface MetaData {
	voter: Voter;
	votes: number;
	category: Category;
	participant: User;
}
