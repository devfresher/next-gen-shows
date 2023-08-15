import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import UserController from './user.controller';
import UserValidator from './user.validate';
import AuthMiddleware from '../../middleware/auth';

const router = Router();

router.put(
	'/onboarding',
	AuthMiddleware.authenticateToken,
	ValidationMiddleware.validateRequest(UserValidator.onboarding),
	UserController.onboarding
);

router.put(
	'/update-profile',
	AuthMiddleware.authenticateToken,
	ValidationMiddleware.validateRequest(UserValidator.updateProfile),
	UserController.updateProfile
);
export default router;
