import { FilterQuery, ID, PageFilter } from '../../types/general';
import { CreateUserInput, OnboardData, UpdateUserInput, User } from '../../types/user';
import UserModel from '../../db/models/user.model';
import AuthService from '../auth/auth.service';
import { BadRequestError, ConflictError, NotFoundError } from '../../errors';
import { sendEmail } from '../mailer/EmailService';
import { config } from '../../utils/config';
import { PaginateOptions, PaginateResult } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import ParticipationService from '../participation/participation.service';
import TalentService from '../talent/talent.service';
import CountryService from '../country/country.service';

export default class UserService {
	static model = UserModel;

	static async getOne(filterQuery: FilterQuery, sensitive = true): Promise<User | null> {
		const projection = sensitive ? { password: 0, passwordReset: 0 } : {};
		const user = await this.model.findOne(filterQuery, projection);

		return user || null;
	}

	public static async exist(id: ID): Promise<User> {
		const user = await this.model.findById(id);
		if (!user) throw new NotFoundError('User not found');

		return user;
	}

	static async getUserProfile(userId: string): Promise<any> {
		const user = await (
			await this.getOne({ _id: userId }, true)
		).populate([
			{ path: 'talent', select: '_id name' },
			{ path: 'country', select: '_id name' },
		]);
		if (!user) throw new NotFoundError('User does not exist');

		const stats = await ParticipationService.getParticipantStats(user._id);
		const events = await ParticipationService.getParticipantEvents(user._id);
		return { user, stats, events };
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<User>> {
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

	public static async getManyForService(filterQuery: FilterQuery): Promise<User[]> {
		return await this.model.find(filterQuery);
	}

	static async createUser(userData: CreateUserInput): Promise<User> {
		const { email, password, phoneNumber } = userData;

		let user = await this.getOne({ email });
		if (user) throw new ConflictError('Email address already taken');

		let newUser = new this.model({
			email,
			phoneNumber,
			password: await AuthService.hashPassword(password),
			isParticipant: true,
		});

		await newUser.save();

		user = await this.getOne({ email });
		const activationToken = await AuthService.generateAuthToken(user);
		const activationLink = `${config.BASE_URL}/activate/${activationToken.token}`;
		sendEmail({
			recipientEmail: email,
			templateName: 'welcome',
			templateData: {
				user,
				activation: { link: activationLink, expiry: activationToken.expiresAt },
			},
		});
		return user;
	}

	static async onboardParticipant(userId: string, userData: OnboardData): Promise<User> {
		const {
			firstName,
			lastName,
			stageName,
			portfolio,
			talentId,
			reason,
			countryId,
			city,
			idNumber,
			validId,
		} = userData;

		let user = await this.exist(userId);
		await TalentService.exist(talentId);
		await CountryService.exist(countryId);

		const stageNameExist = await this.getOne({ stageName });
		if (stageNameExist) throw new BadRequestError('Stage name already chosen');

		const updateData: UpdateUserInput = {
			firstName,
			lastName,
			stageName,
			talent: talentId,
			reason,
			portfolio,
			country: countryId,
			city,
			isOnboard: true,
			validId,
			idNumber,
		};

		user = await this.updateUser(userId, updateData);
		return user;
	}

	static async updateUser(userId: string, userData: UpdateUserInput): Promise<User> {
		const {
			firstName,
			lastName,
			stageName,
			emailVerified,
			phoneNumber,
			portfolio,
			talent,
			reason,
			country,
			city,
			isOnboard,
			profileImage,
			idNumber,
			validId,
		} = userData;

		let user = await this.getOne({ _id: userId });
		if (!user) throw new NotFoundError('User not found');

		await this.model.updateOne(
			{ _id: userId },
			{
				firstName,
				lastName,
				stageName,
				emailVerified,
				phoneNumber,
				portfolio,
				talent,
				reason,
				country,
				city,
				isOnboard,
				profileImage,
				validId,
				idNumber,
			}
		);
		user = await this.getOne({ _id: userId });
		return user;
	}

	public static async profileCompleted(user: User): Promise<User> {
		if (
			user?.firstName &&
			user?.lastName &&
			user?.email &&
			user?.phoneNumber &&
			user?.portfolio &&
			user?.country &&
			user.talent
		)
			return user;

		throw new BadRequestError('Profile not completed');
	}
}
