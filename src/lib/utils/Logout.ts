import { goto } from '$app/navigation';
import {
	chatIdNewChat,
	globalUsername,
	notificationList,
	profilePicture,
	refreshToken,
	token
} from '$lib/Store';

export function logout() {
	token.set('');
	refreshToken.set('');
	globalUsername.set('');
	profilePicture.set('');
	notificationList.set({ records: [] });
	chatIdNewChat.set('');
	if (location.pathname !== '/') {
		goto('/');
		setTimeout(() => {
			location.reload();
		}, 100);
	} else {
		location.reload();
	}
}
