import { NextFunction, Request, Response } from 'express';
import OtherService from './other.service';
import SettingModel from '../../db/models/setting.model';

export default class OtherController {
	static async submitContactForm(req: Request, res: Response, next: NextFunction) {
		try {
			const eventData = req.body;

			await OtherService.processContactForm(eventData);
			res.status(201).json({
				message: 'Contact message submitted successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateActiveStage(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				body: { stage },
			} = req;

			await SettingModel.updateOne(
				{ key: 'activeStage' },
				{ value: stage },
				{ upsert: true }
			);
			res.status(201).json({
				message: `Stage ${stage} is currently active`,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getActiveStage(req: Request, res: Response, next: NextFunction) {
		try {
			const setting = await SettingModel.findOne({ key: 'activeStage' });
			res.status(201).json({
				message: `Current stage retrieved`,
				data: setting?.value || 1,
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
