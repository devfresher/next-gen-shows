import { NextFunction, Request, Response } from 'express';
import OtherService from './other.service';

export default class OtherController {
	static async submitContactForm(req: Request, res: Response, next: NextFunction) {
		try {
			const eventData = req.body;
			console.log(eventData);

			await OtherService.processContactForm(eventData);
			res.status(201).json({
				message: 'Contact message submitted successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}
