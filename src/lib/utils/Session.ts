import { goto } from '$app/navigation';
import { refreshToken, serverURL, token } from '$lib/Store';
import type { NewToken, TokenStructure } from '$lib/types/Token';
import { jwtDecode } from 'jwt-decode';
import { get } from 'svelte/store';
import { logout } from './Logout';
import { handleRequestError } from './ErrorHandling';
import { t } from '../../i18n';
import type { ToastStore } from '@skeletonlabs/skeleton';

export async function refreshTokenFetch(refreshToken: string, toastStore: ToastStore) {
	let newTokens: NewToken = {
		token: '',
		refreshToken: ''
	};
	const response = await fetch(`${get(serverURL)}/users/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			refreshToken: refreshToken
		})
	});
	if (response.status == 200) {
		newTokens = (await response.json()) as NewToken;
	}
	handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	return newTokens;
}

export async function manageSession(toastStore: ToastStore) {
	const date = new Date();
	if (get(token)) {
		const tokenData = decodeToken(get(token));
		const tokenDate = new Date(Number(tokenData.exp) * 1000);
		if (tokenDate < date) {
			//if token is expired
			const refreshTokenData = decodeToken(get(refreshToken));
			const refreshTokenDate = new Date(Number(refreshTokenData.exp) * 1000);
			if (refreshTokenDate < date) {
				//if refreshToken is expired
				logout();
			} else {
				//get new tokens
				const newTokens: NewToken = await refreshTokenFetch(get(refreshToken), toastStore);
				if (newTokens.token !== '' && newTokens.refreshToken !== '') {
					token.set(newTokens.token);
					refreshToken.set(newTokens.refreshToken);
					location.reload();
				} else {
					logout();
				}
			}
		}
	} else {
		goto('/');
	}
}

// decode token to get the expiration dates
export function decodeToken(token: string) {
	const decodedToken: TokenStructure = jwtDecode(token);
	return decodedToken;
}
