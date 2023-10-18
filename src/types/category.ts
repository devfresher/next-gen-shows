import { Country } from './country';
import { Talent } from './talent';
import { ID } from './general';
import { Event } from './event';

export interface Category extends Document {
	_id: ID;
	name: string;
	label: string;
	description: string;
	talent: Talent | ID;
	country: Country | ID;
	event: Event | ID;
	createdAt: Date;
}

export interface CreateCategoryInput {
	name: string;
	description: string;
	eventId: ID;
	talentId: ID;
	countryId: ID;
}

export interface UpdateCategoryInput {
	name?: string;
	description?: string;
	eventId?: ID;
	talentId?: ID;
	countryId?: ID;
}
