// functions for specific error handling

import type { ToastStore } from '@skeletonlabs/skeleton';
import { createToast } from './Toasts';
import { get } from 'svelte/store';
import { t } from '../../i18n';

export function unauthorizedError(toastStore: ToastStore) {
	toastStore.trigger(createToast(`${get(t)('requestError.unauthorized')}`, 'error'));
}

export function forbiddenError(toastStore: ToastStore) {
	toastStore.trigger(createToast(`${get(t)('requestError.forbidden')}`, 'error'));
}

export function notFoundError(toastStore: ToastStore, resourceType: string | undefined) {
	toastStore.trigger(createToast(`${resourceType} ${get(t)('requestError.notFound')}`, 'error'));
}

export function internalServerError(toastStore: ToastStore) {
	toastStore.trigger(createToast(`${get(t)('requestError.internalServerError')}`, 'error'));
}

export function unknownError(toastStore: ToastStore) {
	toastStore.trigger(createToast(`${get(t)('requestError.unknown')}`, 'error'));
}

export function customError(toastStore: ToastStore, message: string) {
	toastStore.trigger(createToast(message, 'error'));
}
export function badRequestError(toastStore: ToastStore) {
	toastStore.trigger(createToast(`${get(t)('requestError.BadRequest')}`, 'error'));
}
