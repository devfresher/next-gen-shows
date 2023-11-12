import { NextFunction, Request, Response } from 'express';
import CategoryService from './category.service';
import { FilterQuery, PageFilter } from '../../types/general';
import EventService from '../events/event.service';

export default class CategoryController {
	static async index(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			let filterQuery: FilterQuery = {};
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			const categories = await CategoryService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Categories retrieved successfully',
				data: categories,
			});
		} catch (error) {
			next(error);
		}
	}

	static async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { categoryId } = req.params;

			const category = await CategoryService.getOne({ _id: categoryId });
			res.status(200).json({
				message: 'Category retrieved successfully',
				data: category,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			let filterQuery: FilterQuery = {};
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			const categories = await CategoryService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Categories retrieved successfully',
				data: categories,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAllEventCategories(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				params: { eventId },
				query: { page, limit, country, talent },
			} = req;
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			await EventService.exist(eventId);
			const query: FilterQuery = { event: eventId };

			if (country) query.country = country;
			if (talent) query.talent = talent;
			const categories = await CategoryService.getMany(query, pageFilter);

			res.status(200).json({
				message: 'All event categories retrieved successfully',
				data: categories,
			});
		} catch (error) {
			next(error);
		}
	}

	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const categoryData = req.body;

			const category = await CategoryService.create(categoryData);
			res.status(201).json({
				message: 'Category created successfully',
				data: category,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const updateData = req.body;
			const { categoryId } = req.params;

			const category = await CategoryService.update(categoryId, updateData);
			res.status(200).json({
				message: 'Category updated successfully',
				data: category,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const { categoryId } = req.params;
			await CategoryService.delete(categoryId);

			res.status(200).json({
				message: 'Category deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	}
}
