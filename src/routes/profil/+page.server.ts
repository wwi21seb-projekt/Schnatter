import { serverURL } from '$lib/Store';
import type { Profil } from '$lib/types/User';
import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';
import { URLSearchParams } from 'url';
import type { ProfileFeed } from '$lib/types/Feed';

export const load = (async () => {
	let stausCodeDetails: number = 0;
	let stausCodeFeed: number = 0;
	let user: Profil = {
		username: 'not Found',
		nickname: '',
		status: '',
		profilePictureUrl: '/default-avatar.png',
		follower: 0,
		following: 0,
		posts: 0
	};

	let feed: ProfileFeed = {
		records: [{
			postId: 'eb8cc60e-6a1e-42fc-8c35-61122bfdc04b',
			creationDate: new Date(),
			content: 'ddsdsd'
		}],
		pagination: { limit: 3, offset: 3, records: 2 }

	};

	const urlSearchParams = new URLSearchParams({ offset: '10', limit: '2' });
	try {
		const serverUrl: string = get(serverURL) ?? '';
		const username = 'mabu2807';
		const urlDetails = serverUrl + '/users/' + username;
		const responseDetails = await fetch(urlDetails, {
			method: 'GET',
			mode: 'cors'
		});
		user = await responseDetails.json();
		stausCodeDetails = await responseDetails.status;
		const urlFeed = serverUrl + '/users/' + username + '/feed?' + urlSearchParams;
		const responseFeed = await fetch(urlFeed, {
			mode: 'cors',
			method: 'GET'
		});

		feed = await responseFeed.json();
		stausCodeFeed = await responseFeed.status;

		if (user.profilePictureUrl == '' || user.profilePictureUrl == undefined) {
			user.profilePictureUrl = '/default-avatar.png';
		}
	} catch (error) {
		stausCodeDetails = 500;
	}
	console.log(feed);
	return {
		user: user,
		feed: feed,
		statusCodeDetails: stausCodeDetails,
		statusCodeFeed: stausCodeFeed
	};
}) satisfies PageServerLoad;
