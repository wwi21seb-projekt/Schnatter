import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import type { Feed } from '$lib/types/Feed';
import { get } from 'svelte/store';

import { createToast } from '$lib/utils/Toasts';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function getSearchPosts(token: string, postId: string, q: string, limit: number) {
	let customError: CustomError = {
		code: '',
		message: ''
	};

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

	const url = get(serverURL) + '/posts?' + params;
	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	if (response.status === 200) {
		data = (await response.json()) as Feed;
	}
	if (response.status !== 200 && response.status !== 500) {
		customError = (await response.json()) as CustomError;
		return { customError: customError, status: response.status };
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
	try {
		const response = await getSearchPosts(token, postId, q, limit);

		if (response.status === 200 && response.data) {
			if (response.data.records.length !== 0) {
				feedData.records = feedData.records.concat(response.data.records);
				feedData.pagination.lastPostId = response.data.pagination.lastPostId;
				feedData.pagination.records = response.data.pagination.records;
			}
		} else if (response.status !== 200 && response.status !== 500 && response.customError) {
			toastStore.clear();
			toastStore.trigger(createToast(response.customError.message, 'error'));
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast(get(t)('toast.internalError'), 'error'));
	}
	return { feedData };
}
