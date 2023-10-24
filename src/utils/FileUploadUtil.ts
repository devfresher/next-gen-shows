import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BadRequestError } from '../errors';
import UploadMiddleware from '../middleware/fileUpload';

class FileUploadUtil {
	private supportedFormats = {
		image: ['.jpeg', '.jpg', '.png'],
		video: ['.mp4', '.avi', '.mkv'],
		csv: ['.csv'],
	};
	private maxFileSize = 60 * 1024 * 1024;

	private createMulter = (
		fieldName: string,
		formats: string[],
		destination: string
	): RequestHandler => {
		return multer({
			storage: multer.diskStorage({
				destination: (req, file, cb) => {
					cb(null, destination);
				},
				filename: (req, file, cb) => {
					cb(null, file.originalname);
				},
			}),
			fileFilter: (req: Request, file, cb) => {
				const ext = path.extname(file.originalname);
				if (!formats.includes(ext)) {
					req.fileValidationError = `Unsupported file format. Expecting ${formats.join(
						', '
					)} file(s) only`;
					cb(null, false);
				} else {
					cb(null, true);
				}
			},
			limits: { fileSize: this.maxFileSize, files: 1 },
		}).single(fieldName);
	};

	private createFolder(absDestination: string) {
		if (!fs.existsSync(absDestination)) {
			fs.mkdirSync(absDestination);
		}
	}

	public uploadFile(
		fieldName: string,
		format: string,
		destination: string = 'tempUploads'
	): RequestHandler {
		const absDestination = path.resolve(process.cwd(), destination);
		this.createFolder(absDestination);
		const upload = this.createMulter(fieldName, this.supportedFormats[format], destination);

		return (req: Request, res: Response, next: NextFunction) => {
			upload(req, res, (err: multer.MulterError | any): void => {
				if (err instanceof multer.MulterError) {
					err = new BadRequestError(err.message);
				} else if (req.fileValidationError) {
					err = new BadRequestError(req.fileValidationError);
				}

				next(err);
			});
		};
	}
}

export default new FileUploadUtil();
