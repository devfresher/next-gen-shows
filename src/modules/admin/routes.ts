import { Router } from 'express';

import AdminController from './statistics.controller';
import AuthMiddleware from '../../middleware/auth';

const router = Router();

router.get('/dashboard-stats', AuthMiddleware.authenticateAdmin, AdminController.getStats);

export default router;
