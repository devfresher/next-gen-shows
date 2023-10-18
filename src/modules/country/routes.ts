import { Router } from 'express';

import AuthMiddleware from '../../middleware/auth';
import CountryController from './country.controller';

const router = Router();

router.get('/', AuthMiddleware.authenticateAdmin, CountryController.index);

export default router;
