import { serverURL, token } from '$lib/Store';
import { get } from 'svelte/store';
import type { Comments } from './types/Comment';
import type { UUID } from 'crypto';

export async function fetchComments(
	limit: number,
	postId: UUID,
	offset: number
): Promise<Comments | number> {
	let data: Comments = {
		records: [],
		pagination: {
			limit: 0,
			offset: 0,
			records: 0
		}
	};

	const params = new URLSearchParams([
		['limit', limit.toString()],
		['offset', offset.toString()]
	]);

	const fetchOptions: RequestInit = {
		method: 'GET',
		mode: 'cors'
	};

	if (get(token)) {
		fetchOptions.headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		};
	}
	const response = await fetch(
		`${get(serverURL)}/posts/${postId}/comments?/${params}`,
		fetchOptions
	);

	if (response.status === 200) {
		data = await response.json();
		return data;
	} else {
		return response.status;
	}
}
export async function sendComment(postId: UUID, commentText: string) {
	const response = await fetch(`${get(serverURL)}/posts/${postId}/comments`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify({ content: commentText })
	});
	return response;
}
