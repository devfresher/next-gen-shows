import { trim } from "lodash"
import { ConflictError, NotFoundError } from "../../errors"
import { CreateEventInput, Event, UpdateEventInput } from "../../types/event"
import { FilterQuery, PageFilter } from "../../types/general"
import EventModel from "./event.model"
import { PaginateOptions, PaginateResult } from "mongoose"
import Pagination from "../../utils/PaginationUtil"

export default class EventService {
	private static model = EventModel

	public static async getOne(filterQuery: FilterQuery): Promise<Event | null> {
		const event = await this.model.findOne(filterQuery)
		return event || null
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Event>> {
		const { page, limit } = pageFilter
		const paginate = !(!page || !limit)

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
		}

		return await this.model.paginate(filterQuery, paginateOption)
	}

	public static async create(eventData: CreateEventInput): Promise<Event> {
		const { eventName, description, categories } = eventData
		let event = await this.getOne({ eventName })

		if (event) throw new ConflictError(`${eventName} already exists`)

		const formattedCategories = categories.split(",").map((category) => {
			return trim(category)
		})
		event = new this.model({
			eventName,
			description,
			categories: formattedCategories,
		})

		await event.save()
		return event
	}

	public static async update(eventId: string, updateData: UpdateEventInput): Promise<Event> {
		let event = await this.getOne({ _id: eventId })
		if (!event) throw new NotFoundError(`Event not found`)

		const { eventName, description, categories } = updateData

		const formattedCategories = categories.split(",").map((category) => {
			return trim(category)
		})
		event.eventName = eventName
		event.description = description
		event.categories = formattedCategories

		await event.save()
		return event
	}

	public static async delete(eventId: string): Promise<void> {
		const event = await this.model.findByIdAndDelete(eventId)
		if (!event) throw new NotFoundError(`Event not found`)
	}
}
