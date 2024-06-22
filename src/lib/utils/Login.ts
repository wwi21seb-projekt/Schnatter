import { serverURL } from '$lib/Store';

export async function login(username: string, password: string) {
	const url = `${serverURL}/users/login`;
	const response = await fetch(url, {
		mode: 'cors',
		method: 'POST',

		body: JSON.stringify({
			username: username,
			password: password
		})
	});
	return response;
}
