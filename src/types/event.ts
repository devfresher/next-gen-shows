import { Document } from 'mongoose';
import { VideoUploadResponse, ImageUploadResponse, VideoFile, ImageFile, ID } from './general';

export interface Event extends Document {
	eventName: string;
	label: string;
	description: string;
	categories: string[];
	coverImage: ImageFile;
	isActive?: boolean;
	video?: VideoFile;
	createdAt: Date;
	contestStart: Date;
	contestEnd: Date;
}

export interface CreateEventInput {
	eventName: string;
	description: string;
	eventCover: ImageUploadResponse;
	eventVideo: VideoUploadResponse;
	eventStart: Date;
	eventEnd: Date;
}

export interface UpdateEventInput {
	eventName?: string;
	description?: string;
	categories?: string;
	isActive?: boolean;
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
	talentId: ID;
	inActionVideo?: VideoUploadResponse;
}
