import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRouter from '../modules/auth/routes';
import userRouter from '../modules/user/routes';
import eventRouter from '../modules/events/routes';
import webRouter from '../modules/web/routes';

import ResponseMiddleware from '../middleware/response';
import { NotFoundError } from '../errors';

const routeApp = function (app: Express) {
	app.use(bodyParser.json());
	app.use(cors());
	app.use(helmet());

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
	router.use('/auth', authRouter);
	router.use('/user', userRouter);
	router.use('/events', eventRouter);

	return router;
};

const webRoutes = (router: Router) => {
	router.use('/', webRouter);

	return router;
};

export default routeApp;
