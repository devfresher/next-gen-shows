import { ID } from './general';

export interface Country extends Document {
	_id: ID;
	name: string;
	label: string;
	continent: string;
	createdAt: Date;
}

export interface CreateCountryInput {
	name: string;
	continent: string;
}
