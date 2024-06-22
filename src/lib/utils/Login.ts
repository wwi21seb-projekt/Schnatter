import { serverURL } from '$lib/Store';

export async function login(username: string, password: string) {
	const response = await fetch(`${serverURL}/users/login`, {
		mode: 'cors',
		method: 'POST',

		body: JSON.stringify({
			username: username,
			password: password
		})
	});
	return response;
}
