import { ConflictError, NotFoundError } from '../../errors';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import TalentModel from '../../db/models/talent.model';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import { CreateTalentInput, Talent, UpdateTalentInput } from '../../types/talent';
import HelperUtil from '../../utils/HelperUtil';

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

	public static async create(talentData: CreateTalentInput): Promise<Talent> {
		const { name, description } = talentData;
		const label = HelperUtil.getLabel(name);

		await this.checkLabel(label);

		const talent = new this.model({
			name,
			label,
			description,
		});

		await talent.save();
		return talent;
	}

	public static async update(talentId: string, updateData: UpdateTalentInput): Promise<Talent> {
		let talent = await this.getOne({ _id: talentId });
		if (!talent) throw new NotFoundError(`Talent not found`);

		const { name, description } = updateData;

		const { name: previousName, label: previousLabel } = talent;

		const label = name && name !== previousName ? HelperUtil.getLabel(name) : previousLabel;
		if (label !== previousLabel) await this.checkLabel(label);

		talent.name = name || previousName;
		talent.label = label;
		talent.description = description || talent.description;

		await talent.save();
		return talent;
	}

	public static async delete(talentId: string): Promise<void> {
		const talent = await this.model.findByIdAndDelete(talentId);
		if (!talent) throw new NotFoundError(`Talent not found`);
	}

	private static async checkLabel(label: string) {
		const talent = await this.getOne({ label });
		if (talent) throw new ConflictError(`Talent ${talent.name} already exists`);
	}
}
