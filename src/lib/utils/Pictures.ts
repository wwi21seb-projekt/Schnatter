export function encodePictureToBase64(picturepath: string): string {
	return 'data:image/png;base64,' + picturepath;
}

export function getInitalsFromUsername(username: string): string {
	return username.substring(0, 2).toUpperCase();
}
