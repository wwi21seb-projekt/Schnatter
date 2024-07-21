import { serverURL, token } from '$lib/Store';
import { get } from 'svelte/store';
import type { Comments } from '../types/Comment';
import type { UUID } from 'crypto';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function fetchComments(
	limit: number,
	postId: UUID,
	offset: number,
	toastStore: ToastStore
) {
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

	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	}
	if (response.status === 200) {
		data = (await response.json()) as Comments;
		return data as Comments;
	}
}

export async function sendComment(postId: UUID, commentText: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/posts/${postId}/comments`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify({ content: commentText })
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	}
	return response;
}
