import { serverURL } from '$lib/Store';
import type { PageServerLoad } from './$types';

type imprint = {
	text: string;
};

export const load = (async () => {
	let serverUrl: string = '';
	serverURL.subscribe((prev_val) => (serverUrl = prev_val));
	const url: string = serverUrl + '/imprint';
	const response = await fetch(url);
	console.log(response);
	const responseObject: imprint = await response.json();
	const imprintText: string = responseObject.text;

	return {
		text: imprintText
	};
}) satisfies PageServerLoad;
