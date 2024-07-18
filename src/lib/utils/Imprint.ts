import { serverURL } from '$lib/Store';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function imprint(toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/imprint`);
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	}
	const responseObject = await response.json();
	return responseObject;
}
