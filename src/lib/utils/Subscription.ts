import { serverURL } from '$lib/Store';
import type { Subscriptions } from '$lib/types/Subscriptions';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import { t } from '../../i18n';
import type { ToastStore } from '@skeletonlabs/skeleton';

export async function getSubscriptions(
	token: string,
	type: string,
	offset: number,
	limit: number,
	username: string,
	toastStore: ToastStore
) {
	let data: Subscriptions = {
		records: [],
		pagination: {
			records: 0,
			limit: 0,
			offset: 0
		}
	};
	const params = new URLSearchParams({
		type: type,
		offset: offset.toString(),
		limit: limit.toString()
	});

	const url = `${get(serverURL)}/subscriptions/${username}?${params}`;

	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	});

	if (response.status === 200) {
		data = (await response.json()) as Subscriptions;
	}

	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}

	return { status: response.status, data: data };
}
