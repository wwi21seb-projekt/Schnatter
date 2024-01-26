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
			lastPostId: '',
			limit: 0,
			records: 0
		}
	};
	const params = new URLSearchParams();

	params.set('postId', postId);
	params.set('limit', limit.toString());

	if (feedType) {
		params.set('feedType', feedType);
	}
	const url: string = get(serverURL) + '/feed?' + params;

	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	if (response.status === 200) {
		data = await response.json();
	}
	if (response.status !== 200 && response.status !== 500) {
		customError = await response.json();
		return { customError: customError, status: response.status };
	}
	return { status: response.status, data: data };
}
