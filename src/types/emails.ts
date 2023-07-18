export interface EmailData {
	templateName: string
	recipientEmail: string
	templateData: {
		appName?: string
		appLogoUrl?: string
		[key: string]: any
	}
}
