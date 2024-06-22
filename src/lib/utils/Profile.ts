import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import type { UserPostFetchResponse } from '$lib/types/Post';
import type { User } from '$lib/types/User';
import { deletePrefixFromBase64 } from '$lib/utils/Pictures';
import { get } from 'svelte/store';

export async function getProfileDetails(token: string, username: string) {
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

	const serverUrl = get(serverURL);
	const url = serverUrl + '/users/' + username;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	user = await response.json();
	statusCode = await response.status;
	return { user: user, statusCode: statusCode };
}
export async function getProfilePosts(token: string, username: string) {
	const params = new URLSearchParams({ offset: '0', limit: '10' });

	const serverUrl = get(serverURL);

	const response = await fetch(serverUrl + '/users/' + username + '/feed?' + params, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	const posts: UserPostFetchResponse = await response.json();
	posts.statusCode = await response.status;

	return posts;
}

export async function updateUserDetails(
	token: string,
	userStatus: string,
	nickname: string,
	pictureUrl: string | undefined
) {
	const serverUrl = get(serverURL) + '/users';
	let body = {};
	if (pictureUrl === undefined) {
		body = {
			status: userStatus,
			nickname: nickname
		};
	} else {
		pictureUrl = deletePrefixFromBase64(pictureUrl);
		body = {
			status: userStatus,
			nickname: nickname,
			picture: pictureUrl
		};
	}
	const response = await fetch(serverUrl, {
		method: 'PUT',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		},
		body: JSON.stringify(body)
	});

	return response.status;
}
export async function loadPosts(token: string, postData: UserPostFetchResponse, username: string) {
	const params = new URLSearchParams({
		offset: postData.records.length.toString(),
		limit: '10'
	});

	const serverUrl = get(serverURL);

	const response = await fetch(serverUrl + '/users/' + username + '/feed?' + params, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	const posts: UserPostFetchResponse = await response.json();
	postData.pagination = posts.pagination;
	if (posts.records !== null) {
		postData.records = postData.records.concat(posts.records);
	}
	posts.statusCode = await response.status;

	return postData;
}

export async function followUser(token: string, following: string) {
	const serverUrl = get(serverURL) + '/subscriptions';
	let customError: CustomError = {
		code: '',
		message: ''
	};
	const response = await fetch(serverUrl, {
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
	if (response.status !== 201 && response.status !== 500) {
		const body = await response.json();
		customError = body.error;
		return { customError: customError, status: response.status };
	}

	return { response: await response.json(), status: response.status };
}

export async function unfollowUser(token: string, subscriptionId: string) {
	const serverUrl = get(serverURL) + '/subscriptions/' + subscriptionId;
	let customError: CustomError = {
		code: '',
		message: ''
	};

	const response = await fetch(serverUrl, {
		method: 'DELETE',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token
		}
	});
	if (response.status !== 204 && response.status !== 500) {
		const body = await response.json();
		customError = body.error;

		return { customError: customError, status: response.status };
	}

	return { status: response.status };
}
