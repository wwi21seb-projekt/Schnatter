import { serverURL, token } from '$lib/Store';
import type { UsersForSearch } from '$lib/types/User';
import { type ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import { t } from '../../i18n';

export async function userSearch(
	usernameInput: string,
	toastStore: ToastStore
): Promise<UsersForSearch | undefined> {
	const response = await fetch(
		`${get(serverURL)}/users?username=${usernameInput}&offset=0&limit=10`,
		{
			mode: 'cors',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + get(token)
			}
		}
	);

	if (response.ok) {
		return (await response.json()) as UsersForSearch;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
		return undefined;
	}
}
