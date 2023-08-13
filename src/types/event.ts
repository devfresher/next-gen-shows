import { Document } from 'mongoose';
import { VideoUploadResponse, ImageUploadResponse } from './general';

export interface Event extends Document {
	eventName: string;
	description: string;
	categories: string[];
	coverImage: {
		url: string;
		imageId: string;
	};
	video?: {
		url: string;
		videoId: string;
	};
	createdAt: Date;
}

export interface CreateEventInput {
	eventName: string;
	description: string;
	categories: string;
	eventCover: ImageUploadResponse;
	eventVideo: VideoUploadResponse;
}

export interface UpdateEventInput {
	eventName: string;
	description: string;
	categories: string;
}

export interface JoinEventInput {
	useAsOnProfile: boolean;
	fullName: string;
	email: string;
	phoneNumber: string;
	portfolio: string;
	videoFile?: Express.Multer.File;
}
