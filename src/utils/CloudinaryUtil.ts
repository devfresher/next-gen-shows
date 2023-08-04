import cloud, { ConfigOptions } from 'cloudinary';
import { config } from './config';

class CloudinaryUtil {
	private cloudinary = cloud.v2;
	private uploadFolder = 'next_gen_show';

	constructor(config: ConfigOptions) {
		this.cloudinary.config(config);
	}

	public async upload(
		file: string,
		resourceType: 'image' | 'video' = 'image',
		folder: string,
		imagePublicId?: string
	): Promise<cloud.UploadApiResponse> {
		let uploadSettings: cloud.UploadApiOptions = {
			resource_type: resourceType,
			folder: folder ? `${this.uploadFolder}/${folder}` : `${this.uploadFolder}`,
			public_id: imagePublicId,
		};
		return await this.cloudinary.uploader.upload(file, uploadSettings);
	}

	public async deleteFromCloudinary(imagePublicId: string): Promise<unknown> {
		return await this.cloudinary.uploader.destroy(imagePublicId);
	}
}

export default new CloudinaryUtil({
	cloud_name: config.CLOUDINARY_NAME,
	api_key: config.CLOUDINARY_KEY,
	api_secret: config.CLOUDINARY_SECRET,
	secure: true,
});
