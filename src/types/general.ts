import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export interface ResponseData {
	status: string;
	code: number;
	message: string;
	data: any;
}

export type ID = string | ObjectId;

export interface FilterQuery {
	_id?: ID;
	[key: string]: any;
}

export interface PageFilter {
	page?: number;
	limit?: number;
}

export interface ContactFormInput {
	firstName: string;
	lastName: string;
	emailAddress: string;
	message: string;
}

export interface VideoUploadResponse {
	videoId: string;
	url: string;
}

export interface ImageUploadResponse {
	imageId: string;
	url: string;
}

export interface VideoFile {
	url: string;
	videoId: string;
}

export interface ImageFile {
	url: string;
	imageId: string;
}
