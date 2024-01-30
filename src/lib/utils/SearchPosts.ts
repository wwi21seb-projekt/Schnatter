import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import type { Feed } from '$lib/types/Feed';
import { get } from 'svelte/store';

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
		data = await response.json();
	}
	if (response.status !== 200 && response.status !== 500) {
		customError = await response.json();
		return { customError: customError, status: response.status };
	}
	return { status: response.status, data: data };
}
