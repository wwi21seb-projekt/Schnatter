import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import { get } from 'svelte/store';
import type { Feed } from '$lib/types/Feed';

export async function getFeed(token: string, limit: number, postId: string, feedType?: string) {
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

	const url: string = get(serverURL) + '/feed?' + params;

	const response = await fetch(url, fetchOptions);

	if (response.status === 200) {
		data = await response.json();
	}
	if (response.status !== 200 && response.status !== 500) {
		customError = await response.json();
		return { customError: customError, status: response.status };
	}
	return { status: response.status, data: data };
}
