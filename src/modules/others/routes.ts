import { Router } from 'express';

import OtherController from './other.controller';
import ValidationMiddleware from '../../middleware/validate';
import OtherValidator from './other.validate';

const router = Router();

router.post(
	'/contact',
	ValidationMiddleware.validateRequest(OtherValidator.contactUs),
	OtherController.submitContactForm
);

export default router;
