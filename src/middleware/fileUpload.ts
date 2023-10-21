import { NextFunction, Request, RequestHandler, Response } from 'express';
import FileUploadUtil from '../utils/FileUploadUtil';
import { BadRequestError } from '../errors';

export default class UploadMiddleware {
	public static uploadSingleVideo(fieldName: string, destination?: string): RequestHandler {
		return FileUploadUtil.uploadFile(fieldName, 'video', destination);
	}

	public static uploadSingleImage(fieldName: string, destination?: string): RequestHandler {
		return FileUploadUtil.uploadFile(fieldName, 'image', destination);
	}

	public static validateUploadedFile(req: Request, res: Response, next: NextFunction) {
		const { file } = req;

		if (!file) throw new BadRequestError('No valid file selected for upload');
		next();
	}
}
