import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';
import type { Feed } from '$lib/types/Feed';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function getFeed(
	token: string,
	limit: number,
	postId: string,
	toastStore: ToastStore,
	feedType?: string
) {
	let data: Feed = {
		records: [],
		pagination: {
			lastPostId: postId,
			limit: limit,
			records: 0
		}
	};
	const params = new URLSearchParams([
		['postId', postId],
		['limit', limit.toString()]
	]);

	if (feedType) {
		params.set('feedType', feedType);
	}

	const fetchOptions: RequestInit = {
		method: 'GET',
		mode: 'cors'
	};

	if (token) {
		fetchOptions.headers = {
			Authorization: 'Bearer ' + token
		};
	}

	const response = await fetch(`${get(serverURL)}/feed?${params}`, fetchOptions);

	if (response.status === 200) {
		data = (await response.json()) as Feed;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	}
	return { status: response.status, data: data };
}
