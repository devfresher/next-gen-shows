import { NextFunction, Request, Response } from 'express';
import TalentService from './talent.service';
import { FilterQuery, PageFilter } from '../../types/general';

export default class TalentController {
	static async createTalent(req: Request, res: Response, next: NextFunction) {
		try {
			const talentData = req.body;

			const talent = await TalentService.create(talentData);
			res.status(201).json({
				message: 'Talent created successfully',
				data: talent,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateTalent(req: Request, res: Response, next: NextFunction) {
		try {
			const updateData = req.body;
			const { talentId } = req.params;

			const talent = await TalentService.update(talentId, updateData);
			res.status(200).json({
				message: 'Talent updated successfully',
				data: talent,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteTalent(req: Request, res: Response, next: NextFunction) {
		try {
			const { talentId } = req.params;
			await TalentService.delete(talentId);

			res.status(200).json({
				message: 'Talent deleted successfully',
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

			const talents = await TalentService.getMany(filterQuery, pageFilter);
			res.status(200).json({
				message: 'Talents retrieved successfully',
				data: talents,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const { talentId } = req.params;

			const talent = await TalentService.exist(talentId);
			res.status(200).json({
				message: 'Talent retrieved successfully',
				data: talent.toObject(),
			});
		} catch (error) {
			next(error);
		}
	}
}
