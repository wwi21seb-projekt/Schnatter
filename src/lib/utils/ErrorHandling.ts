import { type ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';
import { t } from '../../i18n';
import {
	customError,
	forbiddenError,
	internalServerError,
	notFoundError,
	unauthorizedError,
	unknownError
} from './Error';
import { logout } from './Logout';

// functions for normal error handling
export function handleRequestError(
	status: number,
	toastStore: ToastStore,
	resourceType: string | undefined
) {
	toastStore.clear();
	switch (status) {
		case 401:
			unauthorizedError(toastStore);
			setTimeout(() => {
				logout();
			}, 2000);
			break;
		case 403:
			forbiddenError(toastStore);
			break;
		case 404:
			notFoundError(toastStore, resourceType);
			break;
		case 500:
			internalServerError(toastStore);
			break;
		default:
			unknownError(toastStore);
			break;
	}
}

// functions for login error handling
export function handleLoginRequestError(
	status: number,
	toastStore: ToastStore,
	resourceType: string | undefined
) {
	switch (status) {
		case 401:
			customError(toastStore, `${get(t)('requestError.password.wrong')}`);
			break;
		case 404:
			notFoundError(toastStore, resourceType);
			break;
		case 500:
			internalServerError(toastStore);
			break;
		default:
			unknownError(toastStore);
			break;
	}
}
