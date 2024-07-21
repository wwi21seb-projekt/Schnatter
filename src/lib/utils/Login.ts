import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';
import { handleLoginRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function login(username: string, password: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/users/login`, {
		mode: 'cors',
		method: 'POST',

		body: JSON.stringify({
			username: username,
			password: password
		})
	});
	if (!response.ok) {
		handleLoginRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	return response;
}
