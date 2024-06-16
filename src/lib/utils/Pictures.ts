export function deletePrfixFromBase64(base64: string): string {
	return base64.replace(/^data:image\/[a-z]+;base64,/, '');
}

export function getInitalsFromUsername(username: string): string {
	return username.substring(0, 2).toUpperCase();
}
