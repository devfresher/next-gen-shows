import dotenv from 'dotenv';
import debug from 'debug';

const env = !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;
dotenv.config({ path: '.env' });

export const isProduction = env === 'production';
export const isDevelopment = env === 'development';
export const isStaging = env === 'development';

export const config = {
	APP_NAME: `Next Gen Show ${env.toUpperCase()}`,
	APP_LOGO: 'https://',
	HOST: process.env.HOST,
	PORT: process.env.PORT as unknown as number,
	BASE_URL: process.env.BASE_URL,

	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: Number(process.env.REDIS_PORT),
	REDIS_URL: process.env.REDIS_URL,

	NODE_ENV: process.env.NODE_ENV,
	DEBUG: debug('dev'),

	DB_URL: process.env.DB_URL,
	ADMIN_EMAIL: process.env.ADMIN_EMAIL,

	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,

	PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
	PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,

	EVENT_JOIN_AMOUNT: 50,
	EVENT_VOTE_AMOUNT: 50,

	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
	CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
	CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,

	GMAIL_OAUTH: {
		client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
		client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
		refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
		redirect_url: `${
			env !== 'development'
				? 'https://next-gen-show.onrender.com'
				: `http://localhost:${process.env.PORT}`
		}/api/admin/dev/auth/google/callback`,
	},
};
