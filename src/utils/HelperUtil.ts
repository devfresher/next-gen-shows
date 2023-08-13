class HelperUtil {
	public getLabel(name: string): string {
		return `${name.replace(/\s+/g, '-').toLowerCase()}`;
	}

	public capitalize(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}
}

export default new HelperUtil();
