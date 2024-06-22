import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import type { Subscriptions } from '$lib/types/Subscriptions';
import { get } from 'svelte/store';

export async function getSubscriptions(
	token: string,
	type: string,
	offset: number,
	limit: number,
	username: string
) {
	let customError: CustomError = {
		code: '',
		message: ''
	};

	let data: Subscriptions = {
		records: [],
		pagination: {
			limit: 0,
			offset: 0
		}
	};
	const params = new URLSearchParams({
		type: type,
		offset: offset.toString(),
		limit: limit.toString()
	});

	const url = get(serverURL) + '/subscriptions/' + username + '?' + params;

	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	});

	if (response.status === 200) {
		data = (await response.json()) as Subscriptions;
	}
	if (response.status !== 200 && response.status !== 500) {
		customError = (await response.json()) as CustomError;
		return { customError: customError, status: response.status };
	}
	return { status: response.status, data: data };
}
