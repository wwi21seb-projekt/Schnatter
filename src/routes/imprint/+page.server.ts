import { serverURL } from '$lib/Store';
import type { Imprint } from '$lib/types/Imprint';
import type { PageServerLoad } from './$types';



export const load = (async () => {
	const imprint: Imprint = {
		text: '',
		status: 0
	};
	let serverUrl: string = '';
	serverURL.subscribe((prev_val) => (serverUrl = prev_val));
	const url: string = serverUrl + '/imprint';
	const response = await fetch(url);
	const responseObject = await response.json();
	imprint.text = responseObject.text;
	imprint.status = responseObject.status;

	return {
		Imprint: imprint
	};
}) satisfies PageServerLoad;
