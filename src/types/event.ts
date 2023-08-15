import { Document } from 'mongoose';
import { VideoUploadResponse, ImageUploadResponse, VideoFile, ImageFile } from './general';

export interface Event extends Document {
	eventName: string;
	label: string;
	description: string;
	categories: string[];
	coverImage: ImageFile;
	video?: VideoFile;
	createdAt: Date;
	contestStart: Date;
	contestEnd: Date;
}

export interface CreateEventInput {
	eventName: string;
	description: string;
	categories: string;
	eventCover: ImageUploadResponse;
	eventVideo: VideoUploadResponse;
	contestStart: Date;
	contestEnd: Date;
}

export interface UpdateEventInput {
	eventName?: string;
	description?: string;
	categories?: string;
	eventCover?: ImageUploadResponse;
	eventVideo?: VideoUploadResponse;
	contestStart?: Date;
	contestEnd?: Date;
}

export interface JoinEventInput {
	useAsOnProfile: boolean;
	fullName: string;
	email: string;
	phoneNumber: string;
	category: string;
	portfolio: string;
	videoFile?: Express.Multer.File;
}
