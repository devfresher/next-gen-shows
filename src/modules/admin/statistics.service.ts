import EventService from '../events/event.service';
import UserService from '../user/user.service';

export default class StatisticsService {
	static async getDashboardStats() {
		const participants = (
			await UserService.getManyForService({
				isAdmin: false,
				isVoter: false,
			})
		).length;
		const events = (await EventService.getManyForService({})).length;
		const categories = 0;

		return { participants, events, categories };
	}
}
