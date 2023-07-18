import { NextFunction, Request, Response } from "express"
import EventService from "./event.service"
import { CustomRequest, FilterQuery, PageFilter } from "../../types/general"
import ParticipationService from "./participation/participation.service"

export default class EventController {
	static async createEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const eventData = req.body

			const event = await EventService.create(eventData)
			res.status(201).json({
				message: "Event created successfully",
				data: event,
			})
		} catch (error) {
			next(error)
		}
	}

	static async joinAsParticipant(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id
			const { eventId } = req.params
			const data = req.body

			const joinData = await ParticipationService.create(userId, eventId, data)
			res.status(200).json({
				message: "You have successfully joined event",
				data: joinData,
			})
		} catch (error) {
			next(error)
		}
	}

	static async updateEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const updateData = req.body
			const { eventId } = req.params

			const event = await EventService.update(eventId, updateData)
			res.status(200).json({
				message: "Event updated successfully",
				data: event,
			})
		} catch (error) {
			next(error)
		}
	}

	static async deleteEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params
			await EventService.delete(eventId)
			
			res.status(200).json({
				message: "Event deleted successfully",
			})
		} catch (error) {
			next(error)
		}
	}

	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query
			let filterQuery: FilterQuery = {}
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) }

			const eventResult = await EventService.getMany(filterQuery, pageFilter)
			res.status(200).json({
				message: "Event retrieved successfully",
				...eventResult,
			})
		} catch (error) {
			next(error)
		}
	}
}
