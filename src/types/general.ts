import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface ResponseData {
	status: string
	code: number
	message: string
	data: any
}

export interface FilterQuery {
	_id?: string
	[key: string]: any
}

export interface PageFilter {
	page?: number
	limit?: number
}

export type CustomRequest = Request & { user: { _id: string; isAdmin?: boolean } }

export type CustomJWTPayload = JwtPayload & { isAdmin?: boolean; _id: string }
