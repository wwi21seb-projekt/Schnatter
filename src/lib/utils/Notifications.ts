import { serverURL, token } from '$lib/Store';
import type { Notifications } from '$lib/types/Notifications';
import { get } from 'svelte/store';

export async function deleteNotificationRequest(notificationId: string): Promise<boolean> {
	const response = await fetch(`${get(serverURL)}/notifications/${notificationId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (response.status === 204) {
		return true;
	} else {
		return false;
	}
}

export async function getNotificationsRequest(): Promise<Notifications | null> {
	const response = await fetch(`${get(serverURL)}/notifications`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (response.status === 200) {
		return (await response.json()) as Notifications;
	} else {
		return null;
	}
}
