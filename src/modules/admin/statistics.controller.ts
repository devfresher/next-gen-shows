import { NextFunction, Request, Response } from 'express';
import StatisticsService from './statistics.service';

export default class StatisticsController {
	static async getStats(req: Request, res: Response, next: NextFunction) {
		try {
			const dashboardStats = await StatisticsService.getDashboardStats();
			res.status(200).json({
				message: 'Statistics retrieved',
				data: dashboardStats,
			});
		} catch (error) {
			next(error);
		}
	}
}
