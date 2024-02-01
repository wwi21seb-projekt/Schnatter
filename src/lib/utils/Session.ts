import { goto } from '$app/navigation';
import { refreshToken, serverURL, token } from '$lib/Store';
import type { NewToken, TokenStructure } from '$lib/types/Token';
import { jwtDecode } from 'jwt-decode';
import { get } from 'svelte/store';

export async function refreshTokenFetch(refreshToken: string) {
	const serverUrl = get(serverURL);
	let newTokens: NewToken = {
		token: '',
		refreshToken: ''
	};
	const response = await fetch(serverUrl + '/users/refresh', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			refreshToken: refreshToken
		})
	});
	if (response.status == 200) {
		newTokens = await response.json();
	}

	return newTokens;
}

export async function manageSession() {
	const date = new Date();
	if (get(token)) {
		const tokenData = decodeToken(get(token));
		const tokenDate = new Date(Number(tokenData.exp) * 1000);
		if (tokenDate < date) {
			const refreshTokenData = decodeToken(get(refreshToken));
			const refreshTokenDate = new Date(Number(refreshTokenData.exp) * 1000);
			if (refreshTokenDate < date) {
				token.set('');
				refreshToken.set('');
				window.location.reload();
			} else {
				const newTokens: NewToken = await refreshTokenFetch(get(refreshToken));
				if (newTokens.token !== '' && newTokens.refreshToken !== '') {
					token.set(newTokens.token);
					refreshToken.set(newTokens.refreshToken);
					window.location.reload();
				} else {
					token.set('');
					refreshToken.set('');
					window.location.reload();
				}
			}
		}
	} else {
		goto('/');
	}
}

export function decodeToken(token: string) {
	const decodedToken: TokenStructure = jwtDecode(token);
	return decodedToken;
}
