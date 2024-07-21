import { serverURL } from '$lib/Store';
import type { Feed } from '$lib/types/Feed';
import { get } from 'svelte/store';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';
import { handleRequestError } from './ErrorHandling';

export async function getSearchPosts(
	token: string,
	postId: string,
	q: string,
	limit: number,
	toastStore: ToastStore
) {
	let data: Feed = {
		records: [],
		pagination: {
			lastPostId: postId,
			limit: limit,
			records: 0
		}
	};
	const params = new URLSearchParams({
		q: q,
		postId: postId,
		limit: limit.toString()
	});
	const response = await fetch(`${get(serverURL)}/posts?${params}`, {
		method: 'GET',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	if (response.status === 200) {
		data = (await response.json()) as Feed;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	}
	return { status: response.status, data: data };
}

export async function searchPostsByHashtag(
	token: string,
	toastStore: ToastStore,
	q: string,
	feedData: Feed,
	postId: string,
	limit: number
) {
	const response = await getSearchPosts(token, postId, q, limit, toastStore);

	if (response.status === 200 && response.data) {
		if (response.data.records.length !== 0) {
			feedData.records = feedData.records.concat(response.data.records);
			feedData.pagination.lastPostId = response.data.pagination.lastPostId;
			feedData.pagination.records = response.data.pagination.records;
		}
	}

	return { feedData };
}
