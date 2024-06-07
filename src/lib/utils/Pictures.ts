export function encodePictureToBase64(picturepath: string): string {
	const encodePictureToBase64 = btoa(picturepath);
	return encodePictureToBase64;
}

// export function decodeBase64ToPicture(base64: string): string {
// 	const decodeString = base64.replace(/^data:image\/[a-z]+;base64,/, '');
// 	return atob(decodeString);
// }

export function getInitalsFromUsername(username: string): string {
	return username.substring(0, 2).toUpperCase();
}
