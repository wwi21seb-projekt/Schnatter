export function convertDateTime(createdAt: string) {
	let messageTime = '';
	const date = new Date(createdAt);
	const now = new Date();
	const nowDate = now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();
	const messageDateDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	if (date.getMinutes() < 10) {
		messageTime = date.getHours() + ':0' + date.getMinutes();
	} else {
		messageTime = date.getHours() + ':' + date.getMinutes();
	}
	if (nowDate === messageDateDate) {
		return messageTime;
	}
	return messageDateDate + ' ' + messageTime;
}
