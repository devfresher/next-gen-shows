import { NextFunction, Request, Response } from 'express';
import OtherService from './other.service';
import { BadRequestError } from '../../errors';

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

	static async uploadVideo(req: Request, res: Response, next: NextFunction) {
		try {
			const { file } = req;

			const uploadedVideo = await OtherService.processVideoUpload(file);
			res.status(201).json({
				message: 'Video uploaded successfully',
				data: uploadedVideo,
			});
		} catch (error) {
			next(error);
		}
	}

	static async uploadImage(req: Request, res: Response, next: NextFunction) {
		try {
			const { file } = req;

			const uploadedImage = await OtherService.processImageUpload(file);
			res.status(201).json({
				message: 'Image uploaded successfully',
				data: uploadedImage,
			});
		} catch (error) {
			next(error);
		}
	}
}
