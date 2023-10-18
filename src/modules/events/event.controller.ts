import { NextFunction, Request, Response } from 'express';
import EventService from './event.service';
import { FilterQuery, PageFilter } from '../../types/general';

export default class EventController {
	static async createEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const eventData = req.body;

			const event = await EventService.create(eventData);
			res.status(201).json({
				message: 'Event created successfully',
				data: event,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const updateData = req.body;
			const { eventId } = req.params;

			const event = await EventService.update(eventId, updateData);
			res.status(200).json({
				message: 'Event updated successfully',
				data: event,
			});
		} catch (error) {
			next(error);
		}
	}

	static async toggleActive(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params;

			let event = await EventService.getOne({ _id: eventId });
			event = await EventService.update(eventId, { isActive: !event.isActive });

			res.status(200).json({
				message: `Event ${event.isActive ? 'activated' : 'deactivated'} successfully`,
				data: event,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params;
			await EventService.delete(eventId);

			res.status(200).json({
				message: 'Event deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			let filterQuery: FilterQuery = {};
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			const events = await EventService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Events retrieved successfully',
				data: events,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getUpcomingEvents(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			const now = new Date();
			let filterQuery: FilterQuery = { contestStart: { $gt: now }, isActive: false };
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			const events = await EventService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Upcoming events retrieved successfully',
				data: events,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOngoingEvent(req: Request, res: Response, next: NextFunction) {
		try {
			let filterQuery: FilterQuery = { isActive: true };

			const event = await EventService.getOne(filterQuery);
			res.status(200).json({
				message: 'Ongoing event retrieved successfully',
				data: event,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params;

			const event = await EventService.exist(eventId);
			res.status(200).json({
				message: 'Event retrieved successfully',
				data: event.toObject(),
			});
		} catch (error) {
			next(error);
		}
	}
}
