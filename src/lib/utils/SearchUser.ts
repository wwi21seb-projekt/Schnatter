import { serverURL, token } from '$lib/Store';
import { createToast } from '$lib/Toasts';
import type { UsersforSearch } from '$lib/types/User';
import { type ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

let response: Response;
let statusCode: number = 0;

export async function userSearch(
	usernameInput: string,
	toastStore: ToastStore
): Promise<UsersforSearch | undefined> {
	const serverUrl = get(serverURL);
	const url: string = serverUrl + '/users?username=' + usernameInput + '&offset=0&limit=10';

	try {
		response = await fetch(url, {
			mode: 'cors',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + get(token)
			}
		});
		statusCode = response.status;
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast('Internal Error', 'error'));
	}
	if (statusCode == 200) {
		return await response.json();
	} else {
		toastStore.clear();
		toastStore.trigger(createToast('Something went wrong!', 'error'));
		return undefined;
	}
}