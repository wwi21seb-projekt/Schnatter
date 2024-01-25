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
	value,
	hasMorePosts,
	paramsHashtagSearch
} from './FeedDataStore';

let statusCode: number = 0;

export async function loadMorePosts(
	loginToken: string,
	serverUrl: string,
	toastStore: ToastStore,
	pageType: string
) {
	if (pageType === 'home') {
		await loadMoreFeedPosts(loginToken, serverUrl, toastStore);
	} else if (pageType === 'search') {
		await loadMoreHashtagPosts(serverUrl, toastStore);
	}
}

async function loadMoreFeedPosts(loginToken: string, serverUrl: string, toastStore: ToastStore) {
	let customError: CustomError = {
		message: '',
		code: ''
	};

	const lastPostId = get(feedData).pagination.lastPostId;

	if (loginToken !== '') {
		setPostIdAndFeedType(loginToken, lastPostId, get(value));
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
				get(feedData).pagination.lastPostId = result.pagination.lastPostId;
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

async function loadMoreHashtagPosts(serverUrl: string, toastStore: ToastStore) {
	let customError: CustomError = {
		message: '',
		code: ''
	};

	let lastPostId = '';
	const feedDataCopy = get(feedData);

	lastPostId = feedDataCopy.pagination.lastPostId;

	paramsHashtagSearch.set('postId', lastPostId);

	const url: string = serverUrl + '/posts?' + paramsHashtagSearch;
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

export function setPostIdAndFeedType(
	loginToken: string,
	lastPostId: string,
	feedTypeValue: boolean
) {
	paramsChangeable.set('postId', lastPostId);
	if (loginToken !== '' && feedTypeValue) {
		paramsChangeable.set('feedType', 'personal');
	} else {
		paramsChangeable.set('feedType', 'global');
	}
}

export async function fetchPosts(isLoggedIn: boolean, serverUrl: string, toastStore: ToastStore) {
	const params = isLoggedIn ? paramsGlobalOnly : paramsChangeable;
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
			} // braucht man hier ein else?
		} else if (statusCode !== 200 && statusCode !== 500) {
			toastStore.clear();
			toastStore.trigger(createToast(customError.message, 'error'));
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
	}
}

export async function searchHashtagPosts(
	serverUrl: string,
	toastStore: ToastStore,
	hashtagInput: string,
	characterRemoved: boolean
) {
	paramsHashtagSearch.set('q', hashtagInput);
	const url: string = serverUrl + '/posts?' + paramsHashtagSearch;
	let customError: CustomError = {
		message: '',
		code: ''
	};
	if (characterRemoved) {
		posts.set([]);
		feedData.set({
			records: [],
			pagination: {
				lastPostId: '',
				limit: 10,
				records: 0
			}
		});
	}
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

			if (result.records.length !== 0) {
				posts.set(result.records);
				maxPostCounter.update((value) => value + get(posts).length);
				feedData.set(result);
			} else {
				//if input is cleared, posts should be cleared too
				posts.set([]);
				feedData.set({
					records: [],
					pagination: {
						lastPostId: '',
						limit: 10,
						records: 0
					}
				});
				toastStore.clear();
				toastStore.trigger(createToast('No posts found for this hashtag.', 'info'));
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
