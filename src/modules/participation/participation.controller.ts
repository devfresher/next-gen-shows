import { NextFunction, Request, Response } from 'express';
import ParticipationService from './participation.service';
import PaystackUtil from '../../utils/PaystackUtil';
import { config } from '../../utils/config';
import { PageFilter } from '../../types/general';
import { JoinEventInput } from '../../types/event';
import { MetaData } from '../../types/participation';

export default class ParticipationController {
	static async getAllParticipant(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit } = req.query;

			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };
			const participantResult = await ParticipationService.getAllParticipation(pageFilter);

			res.status(200).json({
				message: 'Participants retrieved successfully',
				data: participantResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAllParticipationOfCategory(req: Request, res: Response, next: NextFunction) {
		try {
			const { categoryId } = req.params;
			const { page, limit } = req.query;

			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };
			const participantResult = await ParticipationService.getAllParticipationOfCategory(
				categoryId,
				pageFilter
			);

			res.status(200).json({
				message: 'All Participants retrieved successfully',
				data: participantResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAllParticipationOfEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params;
			const { page, limit } = req.query;

			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };
			const participantResult = await ParticipationService.getAllParticipationOfEvent(
				eventId,
				pageFilter
			);

			res.status(200).json({
				message: 'All Participants retrieved successfully',
				data: participantResult,
			});
		} catch (error) {
			next(error);
		}
	}
	static async getShortlistedParticipationOfCategory(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { categoryId } = req.params;
			const { page, limit } = req.query;

			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };
			const participantResult =
				await ParticipationService.getShortlistedParticipantOfCategory(
					categoryId,
					pageFilter
				);

			res.status(200).json({
				message: 'Shortlisted Participants retrieved successfully',
				data: participantResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getSingleParticipant(req: Request, res: Response, next: NextFunction) {
		try {
			const { categoryId } = req.params;
			const { participantId } = req.params;

			const participant = await ParticipationService.getSingleParticipant(
				categoryId,
				participantId
			);

			res.status(200).json({
				message: 'Participant retrieved successfully',
				data: participant,
			});
		} catch (error) {
			next(error);
		}
	}

	static async markAsShortlisted(req: Request, res: Response, next: NextFunction) {
		try {
			const { categoryId } = req.params;
			const { participantId } = req.params;

			const participant = await ParticipationService.shortlistParticipant(
				categoryId,
				participantId
			);

			res.status(200).json({
				message: 'Participant shortlisted successfully',
				data: participant,
			});
		} catch (error) {
			next(error);
		}
	}

	static async joinEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				user: { _id: userId },
				params: { eventId },
				body: data,
			} = req;

			const { authorization_url } = await ParticipationService.processJoinEvent(
				userId,
				eventId,
				data
			);

			console.log(`${authorization_url}`);
			// res.redirect(`${authorization_url}`);
			res.status(200).send(`${authorization_url}`);
		} catch (error) {
			next(error);
		}
	}

	static async confirmPayment(req: Request, res: Response, next: NextFunction) {
		try {
			const reference = req.query.reference as string;
			const { metadata, status, amount } = await PaystackUtil.verifyPayment(reference);
			const participationMetadata = metadata as unknown as MetaData;

			if (status == 'success') {
				if (amount == config.EVENT_JOIN_AMOUNT * 100) {
					const participation = await ParticipationService.getOne({
						paymentRef: reference,
					});
					if (!participation) {
						await ParticipationService.create(participationMetadata, reference);
						res.send('Payment Successful, you have joined the event as a participant');
					} else {
						res.send('Your request has already been processed');
					}
				} else {
					res.send(
						'Amount paid does not match the required amount. Contact admin for a resolution or try again'
					);
				}
			} else {
				res.send('Payment Failed, try again');
			}
		} catch (error) {
			next(error);
		}
	}
}
