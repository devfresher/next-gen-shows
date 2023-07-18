import nodemailer from "nodemailer"
import { google } from "googleapis"
import { config } from "../../../utils/config"

const oauthConfig = config.GMAIL_OAUTH
export const oauth2Client = new google.auth.OAuth2(
	oauthConfig.client_id,
	oauthConfig.client_secret,
	oauthConfig.redirect_url
)

export const gmailTransporter = async () => {
	try {
		oauth2Client.setCredentials({ refresh_token: oauthConfig.refresh_token })
		const { token } = await oauth2Client.getAccessToken()

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: config.ADMIN_EMAIL,
				clientId: oauthConfig.client_id,
				clientSecret: oauthConfig.client_secret,
				refreshToken: oauthConfig.refresh_token,
				accessToken: token,
			},
		})

		return transporter
	} catch (error) {
		throw error
	}
}

export const generateAuthUrl = () => {
	return oauth2Client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: ["https://mail.google.com/"],
	})
}
