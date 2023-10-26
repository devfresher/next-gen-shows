import { Router } from 'express';

import ValidationMiddleware from '../../middleware/validate';
import AuthMiddleware from '../../middleware/auth';
import TalentValidator from './talent.validate';
import TalentController from './talent.controller';

const router = Router();

router.post(
	'/',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateRequest(TalentValidator.newTalent),
	TalentController.createTalent
);

router.put(
	'/:talentId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('talentId'),
	ValidationMiddleware.validateRequest(TalentValidator.updateTalent),
	TalentController.updateTalent
);

router.delete(
	'/:talentId',
	AuthMiddleware.authenticateAdmin,
	ValidationMiddleware.validateObjectIds('talentId'),
	TalentController.deleteTalent
);

router.get('/', TalentController.getAll);
router.get('/:talentId', TalentController.getOne);

export default router;
