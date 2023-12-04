import { BadRequestError, ConflictError, NotFoundError } from '../../errors';
import { JoinEventInput } from '../../types/event';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import { Participation, Status, ValidStage } from '../../types/participation';
import CloudinaryUtil from '../../utils/CloudinaryUtil';
import cloud from 'cloudinary';

import UserService from '../user/user.service';
import EventService from '../events/event.service';
import ParticipationModel from '../../db/models/participation.model';
import { MetaData as ParticipationData } from '../../types/participation';
import PaystackUtil from '../../utils/PaystackUtil';
import { config } from '../../utils/config';
import { PaginateResult, PopulateOption, PopulateOptions } from 'mongoose';
import { PaginateOptions } from 'mongoose';
import Pagination from '../../utils/PaginationUtil';
import VotingService from '../voting/voting.service';
import { Voting } from '../../types/voting';
import { Talent } from '../../types/talent';
import { Country } from '../../types/country';
import TalentService from '../talent/talent.service';
import CountryService from '../country/country.service';
import CategoryService from '../category/category.service';

export default class ParticipationService {
	private static model = ParticipationModel;
	private static populatingData = ['user', 'category'];

	public static async getOne(filterQuery: FilterQuery): Promise<Participation | null> {
		const participation = await this.model.findOne(filterQuery);
		return participation || null;
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter,
		populatingData?: PopulateOptions[]
	): Promise<PaginateResult<Participation>> {
		const { page, limit } = pageFilter;
		const paginate = !(!page || !limit);

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
			populate: populatingData || this.populatingData,
		};

		return await this.model.paginate(filterQuery, paginateOption);
	}

	public static async getForService(filterQuery: FilterQuery): Promise<Participation[]> {
		return await this.model.find(filterQuery).populate(this.populatingData);
	}

	public static async create(
		paymentMetaData: ParticipationData,
		paymentRef: string
	): Promise<Participation> {
		let { userId, categoryId, registeredData, multimedia } = paymentMetaData;
		await CategoryService.exist(categoryId);

		const participationData = {
			user: userId,
			category: categoryId,
			registeredData,
			multimedia,
			paymentRef,
		};

		const newParticipation = await (
			await this.model.create(participationData)
		).populate(this.populatingData);
		return newParticipation;
	}

	public static async processJoinEvent(
		userId: ID,
		eventId: ID,
		data: JoinEventInput
	): Promise<any> {
		let { fullName, email, phoneNumber, portfolio, useAsOnProfile, talentId, inActionVideo } =
			data;

		const user = await (await UserService.exist(userId)).populate(['talent', 'country']);
		await EventService.exist(eventId);

		await TalentService.exist(talentId);

		if (useAsOnProfile === true) {
			await UserService.profileCompleted(user);

			fullName = `${user.firstName} ${user.lastName}`;
			phoneNumber = user.phoneNumber;
			email = user.email;
			portfolio = user.portfolio;
		}

		const countryId = (user.country as Country)?._id;
		if (!countryId) throw new BadRequestError('Update your country on your profile');
		await CountryService.exist(countryId);

		const category = await CategoryService.getOne({
			talent: talentId,
			country: countryId,
			event: eventId,
		});

		if (!category)
			throw new BadRequestError('No category matches your talent-country selection');

		const participation = await this.getOne({ user: userId, category: category._id });
		if (participation) throw new ConflictError('You already registered for this event');

		const participationData: ParticipationData = {
			userId,
			categoryId: category._id,
			registeredData: {
				name: fullName,
				email,
				phoneNumber,
				portfolio,
			},
			multimedia: {
				id: inActionVideo?.videoId,
				url: inActionVideo?.url,
			},
		};
		const callbackUrl = `${config.BASE_URL}/events/participation/confirm-payment`;
		const amountInKobo = `${config.EVENT_JOIN_AMOUNT * 100}`;
		const initializedPayment = await PaystackUtil.initializePayment(
			amountInKobo,
			user.email,
			participationData,
			callbackUrl
		);
		const {
			data: { reference, authorization_url },
		} = initializedPayment;

		return { reference, authorization_url };
	}

	public static async getAllParticipationOfEvent(
		eventId: ID,
		pageFilter: PageFilter
	): Promise<any> {
		await EventService.exist(eventId);

		const populatingData: PopulateOptions[] = [
			{
				path: 'category',
				populate: [
					{
						path: 'event',
						match: { _id: eventId },
					},
				],
			},
		];

		const { data, paging } = await this.getMany({}, pageFilter, populatingData);
		const participationData = data as Participation[];

		const participationPromise = participationData.map(async (participation) => {
			const { _id, user: participant, ...otherData } = participation.toObject();
			return { participant, ...otherData };
		});

		const allParticipation = await Promise.all(participationPromise);
		return { data: allParticipation, paging };
	}

	public static async getAllParticipationOfCategory(
		categoryId: ID,
		pageFilter: PageFilter
	): Promise<any> {
		await CategoryService.exist(categoryId);

		const { data, paging } = await this.getMany({ category: categoryId }, pageFilter);
		const participationData = data as Participation[];

		const participationPromise = participationData.map(async (participation) => {
			const { _id, user: participant, ...otherData } = participation.toObject();

			if (participant) {
				const participantId = participant?._id;
				const votes = await this.countParticipantVotes(participantId, categoryId);
				return {
					participant: {
						...participant,
						votes,
					},
					...otherData,
				};
			}
			return { participant, ...otherData };
		});

		const allParticipation = await Promise.all(participationPromise);
		return { data: allParticipation, paging };
	}

	public static async getShortlistedParticipantOfCategory(
		categoryId: ID,
		searchText: string,
		pageFilter: PageFilter,
		stage: ValidStage
	): Promise<any> {
		await CategoryService.exist(categoryId);
		const query: FilterQuery = { category: categoryId, status: 'Shortlisted', stage };

		if (searchText) query.userStageName = searchText;
		const { data, paging } = await this.getMany(query, pageFilter);
		const participationData = data as Participation[];

		const participationPromise = participationData.map(async (participation) => {
			const { _id, user: participant, ...otherData } = participation.toObject();

			if (participant) {
				const participantId = participant?._id;
				const votes = await this.countParticipantVotes(participantId, categoryId);
				return {
					participant: {
						...participant,
						votes,
					},
					...otherData,
				};
			}
			return { participant, ...otherData };
		});

		const allParticipation = await Promise.all(participationPromise);
		return { data: allParticipation, paging };
	}

	public static async getAllParticipation(pageFilter: PageFilter): Promise<any> {
		const { data, paging } = await this.getMany({}, pageFilter);
		const participationData = data as Participation[];
		const participationPromise = participationData.map(async (participation) => {
			const { _id, user: participant, ...otherData } = participation.toObject();
			const { category } = otherData;

			if (participant) {
				const participantId = participant?._id;
				const votes = await this.countParticipantVotes(participantId, category?._id);
				return {
					participant: {
						...participant,
						votes,
					},
					...otherData,
				};
			}
			return { participant, ...otherData };
		});

		const allParticipation = await Promise.all(participationPromise);
		return { data: allParticipation, paging };
	}

	public static async getSingleParticipant(categoryId: ID, participantId: ID) {
		await CategoryService.exist(categoryId);
		await UserService.exist(participantId);

		let participation = await ParticipationService.getOne({
			category: categoryId,
			user: participantId,
		});

		if (!participation)
			throw new NotFoundError('User is not a participant of the event category');

		const {
			_id,
			user: participant,
			...otherData
		} = (
			await participation.populate([
				'user',
				{
					path: 'category',
					populate: [
						{ path: 'talent', select: '_id, name' },
						{ path: 'country', select: '_id, name' },
					],
				},
			])
		).toObject();

		const votes = await this.countParticipantVotes(participantId, categoryId);

		return {
			participant: { ...participant, votes },
			...otherData,
		};
	}

	public static async shortlistParticipant(
		categoryId: ID,
		participantId: ID,
		stage: ValidStage
	): Promise<Participation> {
		await CategoryService.exist(categoryId);
		await UserService.exist(participantId);

		const participation = await ParticipationService.getOne({
			category: categoryId,
			user: participantId,
		});

		if (!participation) throw new NotFoundError('User is not a participant of the event');
		if (participation.status == Status.shortlisted)
			throw new ConflictError('Participant is already shortlisted');

		participation.status = Status.shortlisted;
		participation.stage = stage;

		await participation.save();
		return participation;
	}

	public static async countParticipantVotes(participantId: ID, categoryId: ID): Promise<number> {
		const participation = await this.getOne({ user: participantId, category: categoryId });

		if (!participation) {
			return 0;
		}
		const votes = await VotingService.getForService({
			participant: participantId,
			category: categoryId,
		});
		const voteCount = votes.reduce((sum: number, vote: Voting) => (sum += vote.votes), 0);
		return voteCount;
	}

	public static async getParticipantStats(participantId: string): Promise<any> {
		const eventsConfirmed = await this.getForService({
			user: participantId,
			status: 'Confirmed',
		});
		const eventsShortlisted = await this.getForService({
			user: participantId,
			status: 'Shortlisted',
		});

		const eventsJoined = await this.getForService({
			user: participantId,
		});

		return {
			won: eventsConfirmed.length,
			current: eventsShortlisted.length,
			all: eventsJoined.length,
		};
	}

	public static async getParticipantEvents(participantId: string): Promise<any> {
		const allParticipation = await this.getForService({
			user: participantId,
		});

		const events = allParticipation.map((participation) => {
			const { event, user, category, ...otherData } = participation.toObject();
			return { event, category, ...otherData };
		});

		return events;
	}
}
