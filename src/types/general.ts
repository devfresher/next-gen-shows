import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ResponseData {
	status: string;
	code: number;
	message: string;
	data: any;
}

export interface FilterQuery {
	_id?: string;
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
	videoId: string,
	url: string
}

export interface ImageUploadResponse {
	imageId: string,
	url: string
}