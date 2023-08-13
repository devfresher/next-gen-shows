import { ContactFormInput } from '../../types/general';
import CloudinaryUtil from '../../utils/CloudinaryUtil';
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

	public static async processVideoUpload(
		file: Express.Multer.File,
		uploadFolder: string = 'videos'
	) {
		const video = await CloudinaryUtil.upload(file.path, 'video', uploadFolder);
		return { videoId: video.asset_id, url: video.secure_url };
	}

	public static async processImageUpload(
		file: Express.Multer.File,
		uploadFolder: string = 'images'
	) {
		const image = await CloudinaryUtil.upload(file.path, 'image', uploadFolder);
		return { imageId: image.asset_id, url: image.secure_url };
	}
}
