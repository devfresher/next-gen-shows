import { Document } from "mongoose"

export interface Event extends Document {
	eventName: string
	description: string
	categories: string[]
	coverImage: {
		url: string
		imageId: string
	}
	video?: {
		url: string
		videoId: string
	}
	createdAt: Date
}

export interface CreateEventInput {
	eventName: string
	description: string
	categories: string
}

export interface UpdateEventInput {
	eventName: string
	description: string
	categories: string
}

export interface JoinEventInput {
	fullName: string
	email: string
	phoneNumber: string
	portfolio: string
}
