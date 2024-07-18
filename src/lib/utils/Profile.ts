import { serverURL } from '$lib/Store';
import type { UserPostFetchResponse } from '$lib/types/Post';
import type { User } from '$lib/types/User';
import { deletePrefixFromBase64 } from '$lib/utils/Pictures';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function getProfileDetails(token: string, username: string, toastStore: ToastStore) {
	let statusCode: number = 0;
	let user: User = {
		username: 'not Found',
		nickname: '',
		status:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At',
		picture: undefined,
		follower: 0,
		following: 0,
		posts: 0,
		subscriptionId: ''
	};
	const response = await fetch(`${get(serverURL)}/users/${username}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	user = await response.json();
	statusCode = await response.status;
	return { user: user, statusCode: statusCode };
}
export async function getProfilePosts(token: string, username: string, toastStore: ToastStore) {
	const params = new URLSearchParams({ offset: '0', limit: '10' });
	const response = await fetch(`${get(serverURL)}/users/${username}/feed?${params}`, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	const posts: UserPostFetchResponse = await response.json();
	posts.statusCode = await response.status;

	return posts;
}

export async function updateUserDetails(
	token: string,
	userStatus: string,
	nickname: string,
	pictureUrl: string | undefined,
	toastStore: ToastStore
) {
	let body = {};
	if (pictureUrl === undefined) {
		body = {
			status: userStatus,
			nickname: nickname
		};
	} else if (pictureUrl === '') {
		body = {
			status: userStatus,
			nickname: nickname,
			picture: ''
		};
	} else {
		pictureUrl = deletePrefixFromBase64(pictureUrl);
		body = {
			status: userStatus,
			nickname: nickname,
			picture: pictureUrl
		};
	}
	const response = await fetch(`${get(serverURL)}/users`, {
		method: 'PUT',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		},
		body: JSON.stringify(body)
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	return response.status;
}
export async function loadPosts(
	token: string,
	postData: UserPostFetchResponse,
	username: string,
	toastStore: ToastStore
) {
	const params = new URLSearchParams({
		offset: postData.records.length.toString(),
		limit: '10'
	});

	const response = await fetch(`${get(serverURL)}/users/${username}/feed?${params}`, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.user'));
	}
	const posts: UserPostFetchResponse = await response.json();
	postData.pagination = posts.pagination;
	if (posts.records !== null) {
		postData.records = postData.records.concat(posts.records);
	}
	return postData;
}

export async function followUser(token: string, following: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/subscriptions`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		},
		body: JSON.stringify({
			following: following
		})
	});
	if (response.status !== 201) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	}

	return { response: await response.json(), status: response.status };
}

export async function unfollowUser(token: string, subscriptionId: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/subscriptions/${subscriptionId}`, {
		method: 'DELETE',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	if (response.status !== 204) {
		handleRequestError(
			response.status,
			toastStore,
			get(t)('requestError.resourceType.subscription')
		);
	}

	return response.status;
}
