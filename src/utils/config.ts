import dotenv from "dotenv"
import debug from "debug"

const env = !process.env.NODE_ENV ? "development" : process.env.NODE_ENV
dotenv.config({ path: ".env" })

export const isProduction = env === "production"
export const isDevelopment = env === "development"
export const isStaging = env === "development"

export const config = {
	APP_NAME: `Next Gen Show ${env.toUpperCase()}`,
	APP_LOGO: "https://",
	HOST: process.env.HOST,
	PORT: parseInt(process.env.PORT),
	BASE_URL: process.env.BASE_URL,

	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: Number(process.env.REDIS_PORT),

	NODE_ENV: process.env.NODE_ENV,
	DEBUG: debug("dev"),

	DB_URL: process.env.DB_URL,
	ADMIN_EMAIL: process.env.ADMIN_EMAIL,

	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,

	PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
	PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,

	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

	GMAIL_OAUTH: {
		client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
		client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
		refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
		redirect_url: `${
			env !== "development"
				? "https://next-gen-show.onrender.com"
				: `http://localhost:${process.env.PORT}`
		}/api/admin/dev/auth/google/callback`,
	},
}
