import { Document } from 'mongoose';
import { ID } from './general';

export interface Talent extends Document {
	_id: ID;
	name: string;
	label: string;
	description: string;
	createdAt: Date;
}
