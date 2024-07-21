import { serverURL } from '$lib/Store';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import { t } from '../../i18n';
import type { RegisterUser } from '$lib/types/Registration';

export async function registerUser(user: RegisterUser, toastStore: ToastStore) {
	const url: string = get(serverURL) + '/users';
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(user)
	});
	if (response.status !== 201) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	}
	return response;
}
