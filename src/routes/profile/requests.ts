import { serverURL } from '$lib/Store';
import type { UserPostFetchResponse } from '$lib/types/Post';
import type { User } from '$lib/types/User';
import { get } from 'svelte/store';

export async function getProfileDetails(token: string, username: string) {
	let statusCode: number = 0;
	let user: User = {
		username: 'not Found',
		nickname: '',
		status:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At',
		profilePictureUrl: '/default-avatar.png',
		follower: 0,
		following: 0,
		posts: 0,
		subscriptionId: ''
	};

	const serverUrl = get(serverURL);
	const url = serverUrl + '/users/' + username;
	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors'
	});
	user = await response.json();
	statusCode = await response.status;

	if (user.profilePictureUrl == '' || user.profilePictureUrl == undefined) {
		user.profilePictureUrl = '/default-avatar.png';
	}

	return { user: user, statusCode: statusCode };
}
export async function getProfilePosts(token: string, username: string) {
	const params = new URLSearchParams({ offset: '0', limit: '10' });

	const serverUrl = get(serverURL);

	const response = await fetch(serverUrl + '/users/' + username + '/feed?' + params, {
		method: 'GET'
	});
	const posts: UserPostFetchResponse = await response.json();
	posts.statusCode = await response.status;

	return posts;
}

export async function updateUserDetails(token: string, userStatus: string, nickname: string) {
	const serverUrl = get(serverURL) + '/users/';

	const response = await fetch(serverUrl, {
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify({
			nickname: nickname,
			status: userStatus
		})
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
		method: 'GET'
	});
	const posts: UserPostFetchResponse = await response.json();
	postData.pagination = posts.pagination;
	postData.records = postData.records.concat(posts.records);
	posts.statusCode = await response.status;

	return postData;
}

export async function followUser(token: string, following: string) {
	const serverUrl = get(serverURL) + '/subscriptions';

	const response = await fetch(serverUrl, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			following: following
		})
	});

	return response.status;
}

export async function unfollowUser(token: string, subscriptionId: string) {
	const serverUrl = get(serverURL) + '/subscriptions/' + subscriptionId;

	const response = await fetch(serverUrl, {
		method: 'DELETE',
		mode: 'cors'
	});

	return response.status;
}
