import sgMail from "@sendgrid/mail"
import { config } from "../../utils/config.js"

sgMail.setApiKey(config.SENDGRID_API_KEY)
export const sendgridMail = sgMail
