import { ConflictError, NotFoundError } from '../../errors';
import { CreateCategoryInput, Category, UpdateCategoryInput } from '../../types/category';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import CategoryModel from '../../db/models/category.model';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import helperUtil from '../../utils/HelperUtil';
import EventService from '../events/event.service';
import { Country } from '../../types/country';
import { Talent } from '../../types/talent';
import { Event } from '../../types/event';
import CountryService from '../country/country.service';
import TalentService from '../talent/talent.service';

export default class CategoryService {
	private static model = CategoryModel;

	public static async getOne(filterQuery: FilterQuery): Promise<Category | null> {
		const category = await this.model.findOne(filterQuery);
		return category || null;
	}

	public static async exist(id: ID) {
		const category = await this.model.findById(id);
		if (!category) throw new NotFoundError('Category not found');

		return category;
	}

	public static async getManyForService(filterQuery: FilterQuery): Promise<Category[]> {
		return await this.model.find(filterQuery);
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Category>> {
		const { page, limit } = pageFilter;
		const paginate = !(!page || !limit);

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
			populate: ['event', 'talent', 'country'],
		};\

		return await this.model.paginate(filterQuery, paginateOption);
	}

	public static async create(categoryData: CreateCategoryInput): Promise<Category> {
		const { name, description, countryId, talentId, eventId } = categoryData;
		const label = helperUtil.getLabel(name);

		await this.checkLabel(label);
		await CountryService.exist(countryId);
		await TalentService.exist(talentId);
		await EventService.exist(eventId);

		const category = new this.model({
			name,
			label,
			description,
			country: countryId,
			talent: talentId,
			event: eventId,
		});

		await category.save();
		return category;
	}

	public static async update(categoryId: ID, updateData: UpdateCategoryInput): Promise<Category> {
		const category = await this.exist(categoryId);

		const { name, description, countryId, eventId, talentId } = updateData;
		const { name: previousName, label: previousLabel } = category;

		const label = name !== previousName ? helperUtil.getLabel(name) : previousLabel;
		if (label !== previousLabel) await this.checkLabel(label);

		category.name = name || previousName;
		category.label = label;
		category.description = description || category.description;
		category.country = countryId || (category.country as Country)._id;
		category.talent = talentId || (category.talent as Talent)._id;
		category.event = eventId || (category.event as Event)._id;

		await category.save();
		return category;
	}

	public static async delete(categoryId: string): Promise<void> {
		await this.exist(categoryId);
		await this.model.deleteOne({ _id: categoryId });

		return;
	}

	private static async checkLabel(label: string) {
		const category = await this.getOne({ label });
		if (category) throw new ConflictError(`Category ${category.name} already exists`);
	}
}
