import { Express } from "express"
import winston from "winston"
import http from "http"

import logger from "./logger"
import routeApp from "./routes"
import { connectDB } from "./db"
import { config } from "../utils/config"

export default async (app: Express) => {
	logger()

	const { PORT, HOST, APP_NAME } = config
	const server = http.createServer(app)
	routeApp(app)

	try {
		await connectDB()
		server.listen(PORT, HOST, () => {
			winston.info(`${APP_NAME}'s Server started at http://${HOST}:${PORT}`)
		})
	} catch (err) {
		config.DEBUG(err)
	}

	server.on("error", (e: NodeJS.ErrnoException) => {
		if (e.code === "EADDRINUSE") {
			winston.info("Address in use, retrying...")
			setTimeout(() => {
				server.close()
				server.listen(PORT, HOST, () => {
					winston.info(`${APP_NAME}'s Server started at http://${HOST}:${PORT}`)
				})
			}, 1000)
		}
	})
}
