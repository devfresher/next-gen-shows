import { NextFunction, Request, Response } from 'express';
import ParticipationService from './participation.service';
import PaystackUtil from '../../../utils/PaystackUtil';
import { config } from '../../../utils/config';
import { PageFilter } from '../../../types/general';

export default class ParticipationController {
	static async getAllEventParticipants(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId } = req.params;
			const { page, limit } = req.query;

			const pageFilter: PageFilter = { page: Number(page), limit: Number(limit) };
			const participantResult = await ParticipationService.getAllEventParticipants(
				eventId,
				pageFilter
			);

			res.status(200).json({
				message: 'Participants retrieved successfully',
				...participantResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async joinEvent(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user._id;
			const { eventId } = req.params;
			const data = { ...req.body, videoFile: req.file };

			const { authorization_url } = await ParticipationService.processJoinEvent(
				userId,
				eventId,
				data
			);
			// res.send(`${authorization_url}`);
			res.redirect(`${authorization_url}`);
		} catch (error) {
			next(error);
		}
	}

	static async confirmPayment(req: Request, res: Response, next: NextFunction) {
		try {
			const reference = req.query.reference as string;
			const { metadata, status, amount } = await PaystackUtil.verifyPayment(reference);
			const participationMetadata = metadata as any;

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
			res.status(500).send('Error confirming payment');
		}
	}
}
