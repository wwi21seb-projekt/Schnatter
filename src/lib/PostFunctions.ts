import type { PostUserProfilStructure, TextColorPost, PostStructure } from './types/Post';
import { serverURL, token } from '$lib/Store';
import type { CustomError } from './types/CustomError';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { createToast } from '$lib/Toasts';
import { t } from '../i18n';
import { get } from 'svelte/store';
import type { UUID } from 'crypto';

let statusCode: number = 0;

export async function createLike(postId: UUID, toastStore: ToastStore) {
	const serverUrl = get(serverURL);
	let customError: CustomError = {
		message: '',
		code: ''
	};
	const url = serverUrl + '/posts/' + postId + '/likes';
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + get(token) }
		});
		statusCode = response.status;
		if (statusCode !== 204) {
			const body = await response.json();
			customError = body.error;
		}
	} catch (error) {
		toastStore.trigger(createToast(get(t)('toast.internalError'), 'error'));
	}
	if (statusCode !== 204 && statusCode !== 500) {
		toastStore.trigger(createToast(customError.message, 'error'));
	}
}

export async function deleteLike(postId: UUID, toastStore: ToastStore) {
	const serverUrl = get(serverURL);
	let customError: CustomError = {
		message: '',
		code: ''
	};
	const url = serverUrl + '/posts/' + postId + '/likes';
	try {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + get(token) }
		});
		statusCode = response.status;
		if (statusCode !== 204) {
			const body = await response.json();
			customError = body.error;
		}
	} catch (error) {
		toastStore.trigger(createToast(get(t)('toast.internalError'), 'error'));
	}
	if (statusCode !== 204 && statusCode !== 500) {
		toastStore.trigger(createToast(customError.message, 'error'));
	}
}

export function likeCounter(post: PostStructure | PostUserProfilStructure, toastStore: ToastStore) {
	post.likes += post.liked ? -1 : 1;
	if (post.liked) {
		deleteLike(post.postId, toastStore);
	} else {
		createLike(post.postId, toastStore);
	}
	post.liked = !post.liked;
	return post;
}

export function checkForHashtags(post: PostUserProfilStructure | PostStructure) {
	const text = post.content;
	const words = text.split(' ');
	let wordId: number = 0;
	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	if (words !== null) {
		newPost = words.map((word) => {
			let hashtagClass: string = '';
			if (word.startsWith('#')) {
				hashtagClass = 'text-blue-600';
			}
			return { hashtagClass: hashtagClass, text: word, wordID: wordId++ };
		});
	}
	return newPost;
}
