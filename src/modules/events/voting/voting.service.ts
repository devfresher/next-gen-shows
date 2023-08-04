import { BadRequestError } from '../../../errors';
import { Voting, MetaData as VotingMetaData } from '../../../types/voting';

import UserService from '../../user/user.service';
import EventService from '../event.service';
import VotingModel from './voting.model';
import PaystackUtil from '../../../utils/PaystackUtil';
import { config } from '../../../utils/config';
import { FilterQuery, PageFilter } from '../../../types/general';
import { Voter } from '../../../types/user';
import { PaginateResult, PaginateOptions } from 'mongoose';
import Pagination from '../../../utils/PaginationUtil';

export default class VotingService {
	private static model = VotingModel;
	private static populatingData = [{ path: 'voter' }, { path: 'event' }, { path: 'participant' }];

	public static async getOne(filterQuery: FilterQuery): Promise<Voting | null> {
		const voting = await this.model.findOne(filterQuery).populate(this.populatingData);
		return voting || null;
	}

	public static async getMany(
		filterQuery: FilterQuery,
		pageFilter?: PageFilter
	): Promise<PaginateResult<Voting>> {
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

	public static async getForService(filterQuery: FilterQuery): Promise<Voting[]> {
		return await this.model.find(filterQuery);
	}

	public static async create(
		paymentMetaData: VotingMetaData,
		paymentRef: string
	): Promise<Voting> {
		let { voter, event, participant, votes } = paymentMetaData;
		voter = await UserService.getOne({ email: voter.email });
		if (!voter) voter = await UserService.createUser({ ...voter, isVoter: true });

		const votingData = {
			voter: voter._id,
			event,
			votes,
			participant,
			paymentRef,
		};

		const newVoting = new this.model(votingData);
		await newVoting.save();
		return await this.getOne({ _id: newVoting._id.toString() });
	}

	public static async processVoting(
		voter: Voter,
		eventId: string,
		participantId: string,
		votes: number
	): Promise<{ reference: string; authorization_url: string }> {
		const participant = await UserService.getOne({ _id: participantId });
		const event = await EventService.getOne({ _id: eventId });

		if (!participant) throw new BadRequestError('Invalid Participant');
		if (!event) throw new BadRequestError('Invalid Event');

		const votingData: VotingMetaData = {
			voter,
			votes,
			event: eventId,
			participant: participantId,
		};
		const callbackUrl = `${config.BASE_URL}/events/voting/confirm-payment`;
		const amountInKobo = `${config.EVENT_VOTE_AMOUNT * 100 * votes}`;
		const initializedPayment = await PaystackUtil.initializePayment(
			amountInKobo,
			voter.email,
			votingData,
			callbackUrl
		);
		const {
			data: { reference, authorization_url },
		} = initializedPayment;

		return { reference, authorization_url };
	}
}
