export function deletePrefixFromBase64(base64: string): string {
	return base64.replace(/^data:image\/[a-z]+;base64,/, '');
}

//if no profile picture is available, the initials are used as a placeholder
export function getInitalsFromUsername(username: string): string {
	return username.substring(0, 2).toUpperCase();
}
