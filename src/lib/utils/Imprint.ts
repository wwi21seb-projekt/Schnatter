import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';

export async function imprint() {
	const serverUrl = get(serverURL);
	const url: string = serverUrl + '/imprint';
	const response = await fetch(url);
	const responseObject = await response.json();
	return responseObject;
}
