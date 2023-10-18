import { Router } from 'express';

import ParticipationController from '../participation/participation.controller';

const router = Router();

router.get('/participants', ParticipationController.getAllParticipant);

export default router;
