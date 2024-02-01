import { serverURL } from '$lib/Store';
import type { Imprint } from '$lib/types/Imprint';
import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const imprint: Imprint = {
		text: '',
		status: 0
	};
	const serverUrl = get(serverURL);
	const url: string = serverUrl + '/imprint';
	const response = await fetch(url);
	const responseObject = await response.json();
	imprint.text = responseObject.text;
	imprint.status = responseObject.status;

	return {
		imprint: imprint
	};
}) satisfies PageServerLoad;
