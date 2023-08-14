import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import AuthMiddleware from '../../middleware/auth';
import EventValidator from './event.validate';
import EventController from './event.controller';
import UploadMiddleware from '../../middleware/fileUpload';
import ParticipationController from './participation/participation.controller';
import VotingController from './voting/voting.controller';

const router = Router();

router.post(
	'/',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(EventValidator.newEvent),
	EventController.createEvent
);

router.post(
	'/join/:eventId',
	AuthMiddleware.authenticateToken,
	ValidationMiddleware.validateObjectIds('eventId'),
	UploadMiddleware.uploadSingleVideo('in_action_video'),
	ValidationMiddleware.validateRequest(EventValidator.joinEvent),
	ParticipationController.joinEvent
);

router.get('/participation/confirm-payment', ParticipationController.confirmPayment);

router.post(
	'/vote/:eventId/:participantId',
	ValidationMiddleware.validateObjectIds(['eventId', 'participantId']),
	ValidationMiddleware.validateRequest(EventValidator.vote),
	VotingController.vote
);

router.get('/voting/confirm-payment', VotingController.confirmPayment);

router.put(
	'/:eventId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('eventId'),
	ValidationMiddleware.validateRequest(EventValidator.updateEvent),
	EventController.updateEvent
);

router.delete(
	'/:eventId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('eventId'),
	EventController.deleteEvent
);

router.get('/', EventController.getAll);
router.get('/upcoming-events', EventController.getUpcomingEvents);
router.get('/ongoing-events', EventController.getOngoingEvents);
router.get('/:eventId', EventController.getOne);
router.get('/:eventId/participants', ParticipationController.getAllEventParticipants);

export default router;
