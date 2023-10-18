import { NextFunction, Request, Response } from 'express';
import CountryService from './country.service';
import { FilterQuery, PageFilter } from '../../types/general';

export default class CountryController {
	static async index(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;
			let filterQuery: FilterQuery = {};
			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };

			const countries = await CountryService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Countries retrieved successfully',
				data: countries,
			});
		} catch (error) {
			next(error);
		}
	}
}
