import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';

export async function verifyUser(username: string, verifyInput: string) {
	const url = `${get(serverURL)}/users/${username}/activate`;
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			token: verifyInput
		})
	});
	return response;
}

export async function resendToken(username: string) {
	const url = `${get(serverURL)}/users/${username}/activate`;
	const response = await fetch(url, {
		method: 'DELETE'
	});
	return response;
}
