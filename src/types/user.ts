import { Document } from "mongoose"

export interface User extends Document {
	firstName?: string
	lastName?: string
	stageName?: string
	email: string
	password?: string
	isActive: boolean
	emailVerified?: boolean
	isAdmin?: boolean
	phoneNumber?: string
	passwordReset?: {
		token: string
		expiry: Date
	}
	profileImage?: {
		url: string
		imageId: string
	}
	createdAt: Date
}

export interface CreateUserInput {
	email: string
	password: string
	phoneNumber?: string
}

export interface UpdateUserInput {
	firstName?: string
	lastName?: string
	stageName?: string
	talent?: string
	portfolio?: string
	password?: string
	phoneNumber?: string
	emailVerified?: boolean
}
