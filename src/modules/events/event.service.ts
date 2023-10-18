import { trim } from 'lodash';
import { ConflictError, NotFoundError } from '../../errors';
import { CreateEventInput, Event, UpdateEventInput } from '../../types/event';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import EventModel from '../../db/models/event.model';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import helperUtil from '../../utils/HelperUtil';
import CloudinaryUtil from '../../utils/CloudinaryUtil';

export default class EventService {
	private static model = EventModel;

	public static async getOne(filterQuery: FilterQuery): Promise<Event | null> {
		const event = await this.model.findOne(filterQuery);
		return event || null;
	}

	public static async exist(id: ID): Promise<Event> {
		const event = await this.model.findById(id);
		if (!event) throw new NotFoundError('Event not found');

		return event;
	}

	public static async getManyForService(filterQuery: FilterQuery): Promise<Event[]> {
		return await this.model.find(filterQuery);
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Event>> {
		const { page, limit } = pageFilter;
		const paginate = !(!page || !limit);

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
		};

		return await this.model.paginate(filterQuery, paginateOption);
	}

	public static async create(eventData: CreateEventInput): Promise<Event> {
		const { eventName, description, eventCover, eventVideo, eventStart, eventEnd } = eventData;
		const label = helperUtil.getLabel(eventName);

		await this.checkLabel(label);

		const event = new this.model({
			eventName,
			label,
			description,
			coverImage: eventCover,
			video: eventVideo,
			eventStart,
			eventEnd,
		});

		await event.save();
		return event;
	}

	public static async update(eventId: string, updateData: UpdateEventInput): Promise<Event> {
		let event = await this.getOne({ _id: eventId });
		if (!event) throw new NotFoundError(`Event not found`);

		const {
			eventName,
			description,
			eventCover,
			eventVideo,
			contestStart,
			contestEnd,
			isActive,
		} = updateData;

		const { eventName: previousName, label: previousLabel } = event;

		const label =
			eventName && eventName !== previousName
				? helperUtil.getLabel(eventName)
				: previousLabel;
		if (label !== previousLabel) await this.checkLabel(label);

		event.eventName = eventName || previousName;
		event.label = label;
		event.description = description || event.description;
		event.coverImage = eventCover || event.coverImage;
		event.video = eventVideo || event.video;
		event.contestStart = contestStart || event.contestStart;
		event.contestEnd = contestEnd || event.contestEnd;
		event.isActive = isActive;

		await event.save();
		return event;
	}

	public static async delete(eventId: string): Promise<void> {
		const event = await this.model.findByIdAndDelete(eventId);
		if (!event) throw new NotFoundError(`Event not found`);

		await CloudinaryUtil.deleteFromCloudinary(event.coverImage?.imageId);
		await CloudinaryUtil.deleteFromCloudinary(event.video?.videoId);
	}

	private static async checkLabel(label: string) {
		const event = await this.getOne({ label });
		if (event) throw new ConflictError(`Event ${event.eventName} already exists`);
	}
}
