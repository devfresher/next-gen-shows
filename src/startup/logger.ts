import winston from "winston"

const logger = function () {
	winston.add(
		new winston.transports.File({
			filename: "./logs/uncaughtException.log",
		})
	)
	winston.add(new winston.transports.Console())
}

export default logger
