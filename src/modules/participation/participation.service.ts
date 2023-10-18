import { BadRequestError, ConflictError, NotFoundError } from '../../errors';
import { JoinEventInput } from '../../types/event';
import { FilterQuery, ID, PageFilter } from '../../types/general';
import { Participation, Status } from '../../types/participation';
import CloudinaryUtil from '../../utils/CloudinaryUtil';
import cloud from 'cloudinary';

import UserService from '../user/user.service';
import EventService from '../events/event.service';
import ParticipationModel from '../../db/models/participation.model';
import { MetaData as ParticipationData } from '../../types/participation';
import PaystackUtil from '../../utils/PaystackUtil';
import { config } from '../../utils/config';
import { PaginateResult } from 'mongoose';
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
	private static populatingData = [{ path: 'user' }, { path: 'event' }];

	public static async getOne(filterQuery: FilterQuery): Promise<Participation | null> {
		const participation = await this.model.findOne(filterQuery).populate(this.populatingData);
		return participation || null;
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Participation>> {
		const { page, limit } = pageFilter;
		const paginate = !(!page || !limit);

		const paginateOption: PaginateOptions = {
			customLabels: Pagination.label,
			sort: { createdAt: -1 },
			page,
			limit,
			pagination: paginate,
			populate: this.populatingData,
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
		let { user, categoryId, registeredData, multimedia } = paymentMetaData;
		await CategoryService.exist(categoryId);

		const participationData = {
			user,
			categoryId,
			registeredData,
			multimedia,
			paymentRef,
		};

		const newParticipation = new this.model(participationData);
		await newParticipation.save();
		return await this.getOne({ _id: newParticipation._id.toString() });
	}

	public static async processJoinEvent(
		userId: string,
		eventId: string,
		data: JoinEventInput
	): Promise<any> {
		let {
			fullName,
			email,
			phoneNumber,
			portfolio,
			useAsOnProfile,
			videoFile,
			talentId,
			countryId,
		} = data;
		let videoUploaded: cloud.UploadApiResponse;

		const user = await UserService.getOne({ _id: userId });
		const event = await EventService.getOne({ _id: eventId });

		if (!user) throw new BadRequestError('Invalid User');
		if (!event) throw new BadRequestError('Invalid Event');

		if (useAsOnProfile === true) {
			const profileCompleted = await UserService.profileCompleted(userId);
			if (!profileCompleted) throw new BadRequestError('Profile not completed');

			fullName = `${user.firstName} ${user.lastName}`;
			phoneNumber = user.phoneNumber;
			email = user.email;
			portfolio = user.portfolio;
			talentId = (user.talent as Talent)._id;
			countryId = (user.country as Country)._id;
		}

		const talent = await TalentService.exist(talentId);
		const country = await CountryService.exist(countryId);
		const category = await CategoryService.getOne({
			talent: talentId,
			country: countryId,
			event: eventId,
		});
		if (!category)
			throw new BadRequestError('No category matches the talent-country selection');

		if (videoFile) {
			videoUploaded = await CloudinaryUtil.upload(videoFile.path, 'video', 'in_action_video');
		}

		const participation = await this.getOne({ user: userId, event: eventId });
		if (participation) throw new ConflictError('You already registered for this event');

		const participationData: ParticipationData = {
			user: userId,
			categoryId: category._id,
			registeredData: {
				name: fullName,
				email,
				phoneNumber,
				portfolio,
			},
			multimedia: {
				id: videoUploaded?.asset_id,
				url: videoUploaded?.secure_url,
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
		pageFilter: PageFilter
	): Promise<any> {
		await CategoryService.exist(categoryId);

		const { data, paging } = await this.getMany(
			{ category: categoryId, status: 'Shortlisted' },
			pageFilter
		);
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
			const { event } = otherData;

			if (participant) {
				const participantId = participant?._id;
				const votes = await this.countParticipantVotes(participantId, event._id);
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

	public static async getSingleParticipant(categoryId: ID, participantId: ID): Promise<any> {
		await CategoryService.exist(categoryId);
		await UserService.exist(participantId);

		const participation = await ParticipationService.getOne({
			event: categoryId,
			user: participantId,
		});
		if (!participation) throw new NotFoundError('User is not a participant of the event');
		const { _id, user: participant, ...otherData } = participation.toObject();

		const votes = await this.countParticipantVotes(participantId, categoryId);

		return {
			participant: { ...participant, votes },
			...otherData,
		};
	}

	public static async shortlistParticipant(
		categoryId: ID,
		participantId: ID
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
