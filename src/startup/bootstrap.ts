import asyncErrors from 'express-async-errors';
import express, { Express, urlencoded } from 'express';
import winston from 'winston';

import logger from './logger';
import routeApp from './routes';
import { connectDB } from './db';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import ResponseMiddleware from '../middleware/response';
import { Connection } from 'mongoose';
import { NotFoundError } from '../errors';

export default class Server {
	private app: Express;
	private db: Connection;
	private corsOptions: CorsOptions;

	constructor(private name: string, private host: string, private port: number = 3000) {
		this.app = express();
		this.corsOptions = {
			origin: '*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		};

		logger();
		connectDB().then((connection) => {
			this.db = connection;
			this.initializeMiddlewaresAndRoutes();

			['SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((signal) => {
				process.on(signal, async (err) => {
					if (err)
						winston.error(
							`${signal}: Application shutting down due to an unhandled error`,
							err
						);
					this.db.close(() => {
						winston.info('MongoDB connection closed');
						process.exit(0);
					});
				});
			});
		});
	}

	initializeMiddlewaresAndRoutes() {
		this.app.use(bodyParser.json());
		this.app.use(urlencoded({ extended: false }));
		this.app.use(helmet());
		this.app.use(cors());

		routeApp(this.app);

		this.app.all('*', (req, res, next) => {
			throw new NotFoundError(
				`You missed the road. Can not ${req.method} ${req.originalUrl} on this server `
			);
		});
		this.app.use(ResponseMiddleware.errorHandler);
	}

	start() {
		this.app.listen(this.port, () => {
			winston.info(`${this.name}'s Server started at ${this.host}:${this.port}`);
		});
	}
}
