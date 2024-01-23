import type { ToastStore } from '@skeletonlabs/skeleton';
import { createToast } from '$lib/Toasts';
import { token } from '$lib/Store';
import { get } from 'svelte/store';
import type { CustomError } from '$lib/types/CustomError';
import {
	feedData,
	posts,
	paramsChangeable,
	paramsGlobalOnly,
	maxPostCounter,
	feedType,
	value,
	hasMorePosts
} from './FeedDataStore';

let statusCode: number = 0;

export async function loadMorePosts(loginToken: string, serverUrl: string, toastStore: ToastStore) {
	let customError: CustomError = {
		message: '',
		code: ''
	};

	const lastPostId = get(feedData).pagination?.lastPostId?.toString() || '';

	if (loginToken !== '') {
		if (get(value) === 0) {
			paramsChangeable.set('postId', lastPostId);
			paramsChangeable.set('feedType', get(feedType));
		} else if (get(value) === 1) {
			paramsChangeable.set('postId', lastPostId);
		}
	} else {
		paramsGlobalOnly.set('postId', lastPostId);
	}

	const params = loginToken === '' ? paramsGlobalOnly : paramsChangeable;

	const url: string = serverUrl + '/feed?' + params;
	try {
		const response = await fetch(url, {
			mode: 'cors',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + get(token)
			}
		});
		statusCode = response.status;
		if (statusCode !== 200) {
			const body = await response.json();
			customError = body.error;
		}
		if (statusCode === 200) {
			const result = await response.json();
			if (result.records.length === 0) {
				hasMorePosts.set(false);
			} else {
				maxPostCounter.update((n) => n + result.records.length);
				posts.update((currentPosts) => currentPosts.concat(result.records));
				get(feedData).records = get(feedData).records.concat(result.records);
				get(feedData).pagination.lastPostId = get(posts)[get(posts).length - 1].postId;
			}
		} else if (statusCode !== 200 && statusCode !== 500) {
			toastStore.clear();
			toastStore.trigger(createToast(customError.message, 'error'));
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
	}
}

export function setFeedType(loginToken: string) {
	if (loginToken !== '' && get(value) === 1) {
		paramsChangeable.set('feedType', 'personal');
		feedType.set('personal');
	} else {
		paramsChangeable.set('feedType', 'global');
		feedType.set('global');
	}
}

export async function fetchMatchingFeed(
	isGlobal: boolean,
	serverUrl: string,
	toastStore: ToastStore
) {
	const params = isGlobal ? paramsGlobalOnly : paramsChangeable;
	const url: string = serverUrl + '/feed?' + params;
	let customError: CustomError = {
		message: '',
		code: ''
	};
	try {
		const response = await fetch(url, {
			mode: 'cors',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + get(token)
			}
		});
		statusCode = response.status;

		if (statusCode !== 200) {
			const body = await response.json();
			customError = body.error;
		}

		if (statusCode === 200) {
			const result = await response.json();
			posts.set(result.records);
			maxPostCounter.update((value) => value + get(posts).length);
			feedData.set(result);

			if (get(posts).length !== 0) {
				feedData.update((data) => {
					if (data) {
						data.pagination.lastPostId = get(posts)[get(posts).length - 1].postId;
					}
					return data;
				});
			} else {
				feedData.update((data) => {
					if (data) {
						data.pagination.lastPostId = null;
					}
					return data;
				});
			}
		} else if (statusCode !== 200 && statusCode !== 500) {
			toastStore.clear();
			toastStore.trigger(createToast(customError.message, 'error'));
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
	}
}
