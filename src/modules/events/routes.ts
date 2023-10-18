import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import AuthMiddleware from '../../middleware/auth';
import EventValidator from './event.validate';
import EventController from './event.controller';
import UploadMiddleware from '../../middleware/fileUpload';
import ParticipationController from '../participation/participation.controller';
import VotingController from '../voting/voting.controller';

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
	'/vote/:categoryId/:participantId',
	ValidationMiddleware.validateObjectIds(['categoryId', 'participantId']),
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

router.patch(
	'/:eventId/toggle-active',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('eventId'),
	EventController.toggleActive
);

router.delete(
	'/:eventId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('eventId'),
	EventController.deleteEvent
);

router.get('/', AuthMiddleware.authenticateAdmin, EventController.getAll);
router.get('/upcoming-events', EventController.getUpcomingEvents);
router.get('/ongoing-event', EventController.getOngoingEvent);
router.get('/:eventId', EventController.getOne);

export default router;
