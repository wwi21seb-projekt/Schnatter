import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function verifyUser(username: string, verifyInput: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/users/${username}/activate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			token: verifyInput
		})
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	return response;
}

export async function resendToken(username: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/users/${username}/activate`, {
		method: 'DELETE'
	});
	handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	return response;
}
