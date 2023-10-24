import { Express, Router } from 'express';
import authRouter from '../modules/auth/routes';
import userRouter from '../modules/user/routes';
import eventRouter from '../modules/events/routes';
import countryRouter from '../modules/country/routes';
import categoryRouter from '../modules/category/routes';
import talentRouter from '../modules/talent/routes';
import otherRouter from '../modules/others/routes';
import participationRouter from '../modules/participation/routes';
import adminRouter from '../modules/admin/routes';
import webRouter from '../modules/web/routes';

const routeApp = function (app: Express) {
	const router = Router();

	app.use('/api', apiRoutes(router));
	app.use('/', webRoutes(router));
};

const apiRoutes = (router: Router) => {
	router.use('/', otherRouter);
	router.use('/auth', authRouter);
	router.use('/user', userRouter);
	router.use('/events', eventRouter);
	router.use('/countries', countryRouter);
	router.use('/categories', categoryRouter);
	router.use('/talents', talentRouter);
	router.use('/participation', participationRouter);

	router.use('/admin', adminRouter);

	return router;
};

const webRoutes = (router: Router) => {
	router.use('/', webRouter);

	return router;
};

export default routeApp;
