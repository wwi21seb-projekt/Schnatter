import { serverURL, token } from '$lib/Store';
import type { Notifications } from '$lib/types/Notifications';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function deleteNotificationRequest(
	notificationId: string,
	toastStore: ToastStore
): Promise<boolean> {
	const response = await fetch(`${get(serverURL)}/notifications/${notificationId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (response.status === 204) {
		return true;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
		return false;
	}
}

export async function getNotificationsRequest(
	toastStore: ToastStore
): Promise<Notifications | null> {
	const response = await fetch(`${get(serverURL)}/notifications`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (response.status === 200) {
		return (await response.json()) as Notifications;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
		return null;
	}
}
