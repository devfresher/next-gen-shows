import mongoose from "mongoose"
import { config } from "../utils/config"
import winston from "winston"

export const connectDB = async () => {
	mongoose.set("strictQuery", false)
	await mongoose.connect(config.DB_URL)
	winston.info(`${config.APP_NAME} is connected to DB`)
}
