import { ConflictError, NotFoundError } from '../../errors';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import CountryModel from '../../db/models/country.model';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import { Country, CreateCountryInput } from '../../types/country';
import HelperUtil from '../../utils/HelperUtil';

export default class CountryService {
	private static model = CountryModel;

	public static async getOne(filterQuery: FilterQuery): Promise<Country | null> {
		const country = await this.model.findOne(filterQuery);
		return country || null;
	}

	public static async exist(id: ID): Promise<Country> {
		const country = await this.model.findById(id);
		if (!country) throw new NotFoundError('Country not found');

		return country;
	}

	public static async getManyForService(filterQuery: FilterQuery): Promise<Country[]> {
		return await this.model.find(filterQuery);
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Country>> {
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

	public static async create(countryData: CreateCountryInput) {
		const { name, continent } = countryData;
		const label = HelperUtil.getLabel(name);

		await this.checkLabel(label);
		const country = new this.model({
			name,
			label,
			continent,
		});

		await country.save();
		return country;
	}

	private static async checkLabel(label: string) {
		const country = await this.getOne({ label });
		if (country) throw new ConflictError(`Country ${country.name} already exists`);
	}
}
