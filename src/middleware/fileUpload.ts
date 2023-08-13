import { RequestHandler } from 'express';
import FileUploadUtil from '../utils/FileUploadUtil';

export default class UploadMiddleware {
	public static uploadSingleVideo(fieldName: string, destination?: string): RequestHandler {
		return FileUploadUtil.uploadFile(fieldName, 'video', destination);
	}

	public static uploadSingleImage(fieldName: string, destination?: string): RequestHandler {
		return FileUploadUtil.uploadFile(fieldName, 'image', destination);
	}
}
