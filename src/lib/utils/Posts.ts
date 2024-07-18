import type { TextColorPost, PostStructure, RequestBodyData } from '../types/Post';
import { serverURL, token } from '$lib/Store';
import { t } from '../../i18n';
import { get } from 'svelte/store';
import type { UUID } from 'crypto';
import { getLocation, validateCoords } from './GeoLocationUtils';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { deletePrefixFromBase64 } from './Pictures';
import { handleRequestError } from './ErrorHandling';

let statusCode: number = 0;

export async function sendPost(
	text: string,
	repostId: string,
	picture: string,
	toastStore: ToastStore
) {
	//Enter the coordinates to determine the location, if they are specified
	const geoLocationData = await getLocation();
	validateCoords(geoLocationData);
	const bodyData: RequestBodyData = {
		content: text
	};
	if (geoLocationData.latitude != 0 || geoLocationData.longitude != 0) {
		bodyData.location = geoLocationData;
	}
	if (repostId != '') {
		bodyData.repostedPostId = repostId;
	}
	if (picture) {
		picture = deletePrefixFromBase64(picture);
		bodyData.picture = picture;
	}
	const response = await fetch(`${get(serverURL)}/posts`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		},
		body: JSON.stringify(bodyData)
	});
	handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	return response.status;
}

export async function deletePost(postId: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/posts/${postId}`, {
		method: 'DELETE',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + get(token)
		}
	});
	statusCode = response.status;
	if (statusCode !== 204) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	} else {
		location.reload();
	}
}

export async function createLike(postId: UUID, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/posts/${postId}/likes`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + get(token) }
	});
	statusCode = response.status;
	if (statusCode !== 204) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	}
}

export async function deleteLike(postId: UUID, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/posts/${postId}/likes`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + get(token) }
	});
	statusCode = response.status;

	if (statusCode !== 204) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.post'));
	}
}

export function likeCounter(post: PostStructure, toastStore: ToastStore) {
	post.likes += post.liked ? -1 : 1;
	if (post.liked) {
		deleteLike(post.postId, toastStore);
	} else {
		createLike(post.postId, toastStore);
	}
	post.liked = !post.liked;
	return post;
}

export function checkForHashtags(post: PostStructure) {
	const text = post.content;
	//the text is separated into individual parts at each space and Enter
	const words = text.split(/(\s+)/);
	let wordId: number = 0;
	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	if (words !== null) {
		newPost = words.map((word: string) => {
			//all parts of the text are checked to see if they begin with a #,
			//if this is the case they are colored blue
			let hashtagClass: string = '';
			if (word.startsWith('#')) {
				hashtagClass = 'text-blue-600';
			}
			return { hashtagClass: hashtagClass, text: word, wordID: wordId++ };
		});
	}
	return newPost;
}
