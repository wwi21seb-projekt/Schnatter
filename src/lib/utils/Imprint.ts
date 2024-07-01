import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';

export async function imprint() {
	const response = await fetch(`${get(serverURL)}/imprint`);
	const responseObject = await response.json();
	return responseObject;
}
