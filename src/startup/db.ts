import mongoose from 'mongoose';
import { config, isDevelopment } from '../utils/config';
import winston from 'winston';
import migration from '../db/migration';

export const connectDB = () => {
	mongoose.set('strictQuery', false);
	mongoose.connect(config.DB_URL);
	winston.info(`${config.APP_NAME} is connected to DB`);

	// if (isDevelopment) await migration.run();
	return mongoose.connection;
};
