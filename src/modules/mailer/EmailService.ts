import mustache from "mustache"
import fs from "fs"
import path from "path"
import { config } from "../../utils/config"
import { gmailTransporter } from "./providers/gmail"
import { EmailData } from "../../types/emails"

const templateSubjectMatch = {
	welcome: {
		subject: "Welcome to The Next Gen Show",
		file: "welcome.html",
	},
}

export async function sendEmail(data: EmailData) {
	let { templateName, recipientEmail, templateData } = data
	const { file, subject } = templateSubjectMatch[templateName]
	const templateDir = path.join(process.cwd(), "src", "modules", "mailer", "templates")
	const templatePath = path.join(templateDir, file)

	try {
		fs.readFile(templatePath, "utf8", async (err, templateContent) => {
			if (err) throw err

			templateData = {
				...templateData,
				appName: config.APP_NAME,
				appLogoUrl: config.APP_LOGO,
			}
			const html = mustache.render(templateContent, templateData)
			const mailOptions = {
				from: config.ADMIN_EMAIL,
				to: recipientEmail,
				subject,
				html,
			}

			const googleMail = await gmailTransporter()
			googleMail
				.sendMail(mailOptions)
				.then(() => {
					console.log("Email sent by gmail")
				})
				.catch((error: Error) => {
					throw error
				})
		})
	} catch (error) {
		throw error
	}
}
