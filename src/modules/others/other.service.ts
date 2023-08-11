import { ContactFormInput } from '../../types/general';
import { config } from '../../utils/config';
import { sendEmail } from '../mailer/EmailService';

export default class OtherService {
	public static async processContactForm(formData: ContactFormInput): Promise<void> {
		const { firstName, lastName, emailAddress, message } = formData;

		sendEmail({
			recipientEmail: config.ADMIN_EMAIL,
			templateName: 'customer_contact',
			templateData: {
				firstName,
				lastName,
				emailAddress,
				message,
			},
		});
	}
}
