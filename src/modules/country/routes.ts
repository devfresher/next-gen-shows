import { Router } from 'express';

import CountryController from './country.controller';

const router = Router();

router.get('/', CountryController.index);

export default router;
