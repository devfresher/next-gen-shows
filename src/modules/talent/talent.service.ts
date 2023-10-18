import { NotFoundError } from '../../errors';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import TalentModel from '../../db/models/talent.model';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import { Talent } from '../../types/talent';

export default class TalentService {
	private static model = TalentModel;

	public static async getOne(filterQuery: FilterQuery): Promise<Talent | null> {
		const talent = await this.model.findOne(filterQuery);
		return talent || null;
	}

	public static async exist(id: ID): Promise<Talent> {
		const talent = await this.model.findById(id);
		if (!talent) throw new NotFoundError('Talent not found');

		return talent;
	}

	public static async getManyForService(filterQuery: FilterQuery): Promise<Talent[]> {
		return await this.model.find(filterQuery);
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Talent>> {
		const { page, limit } = pageFilter;
		const paginate = !(!page || !limit);

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
		};

		return await this.model.paginate(filterQuery, paginateOption);
	}
}
