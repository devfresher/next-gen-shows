import { Router } from 'express';

import AuthMiddleware from '../../middleware/auth';
import ParticipationController from '../participation/participation.controller';
import ValidationMiddleware from '../../middleware/validate';
import CategoryController from './category.controller';
import CategoryValidator from './event.validate';

const router = Router();

router.post(
	'/',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(CategoryValidator.newCategory),
	CategoryController.create
);

router.get('/:categoryId/participants', ParticipationController.getAllParticipationOfCategory);
router.get(
	'/:categoryId/participants/shortlisted',
	ParticipationController.getShortlistedParticipationOfCategory
);
router.get(
	'/:categoryId/participants/:participantId',
	ParticipationController.getSingleParticipant
);

router.patch(
	'/:categoryId/shortlist/:participantId',
	AuthMiddleware.authenticateAdmin,
	ParticipationController.markAsShortlisted
);

export default router;
