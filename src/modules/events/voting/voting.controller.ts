import { NextFunction, Request, Response } from 'express';
import VotingService from './voting.service';
import { MetaData as VotingMetaData } from '../../../types/voting';
import PaystackUtil from '../../../utils/PaystackUtil';
import { config } from '../../../utils/config';
import { Voter } from '../../../types/user';

export default class VotingController {
	static async vote(req: Request, res: Response, next: NextFunction) {
		try {
			const { eventId, participantId } = req.params;
			const { fullName, email, phoneNumber, numberOfVotes } = req.body;
			const voter: Voter = { fullName, email, phoneNumber };

			const { authorization_url } = await VotingService.processVoting(
				voter,
				eventId,
				participantId,
				numberOfVotes
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
			const votingMetadata = metadata as any;

			if (status == 'success') {
				if (amount == config.EVENT_VOTE_AMOUNT * votingMetadata.votes * 100) {
					const voting = await VotingService.getOne({ paymentRef: reference });
					if (!voting) {
						await VotingService.create(votingMetadata, reference);
						res.send('Payment Successful, your vote(s) has been recorded');
					} else {
						res.send('Your votes has already been recorded');
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
