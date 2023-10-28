import { Router } from 'express';

import OtherController from './other.controller';
import ValidationMiddleware from '../../middleware/validate';
import OtherValidator from './other.validate';
import AuthMiddleware from '../../middleware/auth';
import UploadMiddleware from '../../middleware/fileUpload';

const router = Router();

router.post(
	'/contact',
	ValidationMiddleware.validateRequest(OtherValidator.contactUs),
	OtherController.submitContactForm
);

router.get('/settings/active-stage', OtherController.getActiveStage);
router.put(
	'/settings/active-stage',
	ValidationMiddleware.validateRequest(OtherValidator.activeStage),
	OtherController.updateActiveStage
);

router.post(
	'/upload-video',
	AuthMiddleware.authenticateToken,
	UploadMiddleware.uploadSingleVideo('video'),
	UploadMiddleware.validateUploadedFile,
	OtherController.uploadVideo
);

router.post(
	'/upload-image',
	AuthMiddleware.authenticateToken,
	UploadMiddleware.uploadSingleImage('image'),
	UploadMiddleware.validateUploadedFile,
	OtherController.uploadImage
);

export default router;
