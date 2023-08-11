import mongoose, { PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Event } from '../../types/event';

const eventSchema = new mongoose.Schema({
	eventName: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	categories: {
		type: [String],
		required: true,
	},
	registrationStart: { type: Date },
	reviewStart: { type: Date },
	contestStart: { type: Date },
	contestEnd: { type: Date },
	coverImage: {
		type: {
			url: String,
			imageId: String,
			_id: false,
		},
	},
	video: {
		type: {
			url: String,
			videoId: String,
			_id: false,
		},
	},
	createdAt: { type: Date, default: Date.now },
});

interface EventModel extends PaginateModel<Event, Document> {} // Extend Model with pagination

eventSchema.plugin(paginate);
const EventModel = mongoose.model<Event, EventModel>('Event', eventSchema);
export default EventModel;
