import { goto } from '$app/navigation';
import { globalUsername, notificationList, profilePicture, refreshToken, token } from '$lib/Store';

export function logout() {
	token.set('');
	refreshToken.set('');
	globalUsername.set('');
	profilePicture.set('');
	notificationList.set({ records: [] });
	if (location.pathname !== '/') {
		goto('/');
		setTimeout(() => {
			location.reload();
		}, 100);
	} else {
		location.reload();
	}
}
