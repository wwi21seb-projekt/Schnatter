import { serverURL } from '$lib/Store';
import type { PageServerLoad } from './$types';

type imprint = {
	text: string;
};

export const load = (async () => {
	try {
		let serverUrl: string = '';
		//const text:string = 'hier ist Text';
		serverURL.subscribe((prev_val) => (serverUrl = prev_val));
		const url: string = serverUrl + '/imprint';
		const response = await fetch(url);
		const responseObject: imprint = await response.json();
		const imprintText: string = responseObject.text;

		return {
			text: imprintText
		};
	} catch (error) {
		// continue regardless of error
	}
}) satisfies PageServerLoad;
