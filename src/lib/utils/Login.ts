import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';

export async function login(username: string, password: string) {
	const response = await fetch(`${get(serverURL)}/users/login`, {
		mode: 'cors',
		method: 'POST',

		body: JSON.stringify({
			username: username,
			password: password
		})
	});
	return response;
}
