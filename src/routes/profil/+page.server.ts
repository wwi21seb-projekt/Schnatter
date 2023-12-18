import type { Profil } from '$lib/types/User';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	let statusCode: number = 0;
	let user: Profil = {
		username: 'not Found',
		nickname: '',
		status:
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At',
		profilePictureUrl: '/default-avatar.png',
		follower: 0,
		following: 0,
		posts: 0
	};
	try {
		const username = 'mabu2807';
		const url = 'http://localhost:3000/api' + '/users/' + username;
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors'
		});
		user = await response.json();
		statusCode = await response.status;

		if (user.profilePictureUrl == '' || user.profilePictureUrl == undefined) {
			user.profilePictureUrl = '/default-avatar.png';
		}
	} catch (error) {
		statusCode = 500;
	}
	return { user: user, statusCode: statusCode };
}) satisfies PageServerLoad;
