import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRouter from '../modules/auth/routes';
import userRouter from '../modules/user/routes';
import eventRouter from '../modules/events/routes';
import countryRouter from '../modules/country/routes';
import categoryRouter from '../modules/category/routes';
import talentRouter from '../modules/talent/routes';
import otherRouter from '../modules/others/routes';
import adminRouter from '../modules/admin/routes';
import webRouter from '../modules/web/routes';

import ResponseMiddleware from '../middleware/response';
import { NotFoundError } from '../errors';

const routeApp = function (app: Express) {
	app.use(bodyParser.json());
	app.use(helmet());
	app.use(
		cors({
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		})
	);

	const router = Router();
	app.use('/api', apiRoutes(router));
	app.use('/', webRoutes(router));

	app.all('*', (req, res, next) => {
		throw new NotFoundError(
			`You missed the road. Can not ${req.method} ${req.originalUrl} on this server `
		);
	});

	app.use(ResponseMiddleware.errorHandler);
};

const apiRoutes = (router: Router) => {
	router.use('/', otherRouter);
	router.use('/auth', authRouter);
	router.use('/user', userRouter);
	router.use('/events', eventRouter);
	router.use('/countries', countryRouter);
	router.use('/categories', categoryRouter);
	router.use('/talents', talentRouter);

	router.use('/admin', adminRouter);

	return router;
};

const webRoutes = (router: Router) => {
	router.use('/', webRouter);

	return router;
};

export default routeApp;
