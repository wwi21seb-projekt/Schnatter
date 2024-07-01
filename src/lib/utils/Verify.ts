import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';

export async function verifyUser(username: string, verifyInput: string) {
	const response = await fetch(`${get(serverURL)}/users/${username}/activate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			token: verifyInput
		})
	});
	return response;
}

export async function resendToken(username: string) {
	const response = await fetch(`${get(serverURL)}/users/${username}/activate`, {
		method: 'DELETE'
	});
	return response;
}
