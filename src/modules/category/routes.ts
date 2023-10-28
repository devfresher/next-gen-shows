import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import AuthMiddleware from '../../middleware/auth';
import CategoryValidator from './category.validate';
import CategoryController from './category.controller';
import ParticipationController from '../participation/participation.controller';

const router = Router();

router.post(
	'/',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(CategoryValidator.newCategory),
	CategoryController.create
);

router.put(
	'/:categoryId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('categoryId'),
	ValidationMiddleware.validateRequest(CategoryValidator.updateCategory),
	CategoryController.updateCategory
);

router.delete(
	'/:categoryId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('categoryId'),
	CategoryController.deleteCategory
);

router.get('/', CategoryController.getAll);
router.get('/:categoryId', CategoryController.get);
router.get('/:categoryId/participants', ParticipationController.getAllParticipationOfCategory);
router.patch(
	'/:categoryId/shortlist/:participantId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(CategoryValidator.markShortlist),
	ParticipationController.markAsShortlisted
);
router.get(
	'/:categoryId/participants/shortlisted/:stage',
	ParticipationController.getShortlistedParticipationOfCategory
);
router.get(
	'/:categoryId/participants/:participantId',
	ParticipationController.getSingleParticipant
);
router.get('/event/:eventId', CategoryController.getAllEventCategories);

export default router;
