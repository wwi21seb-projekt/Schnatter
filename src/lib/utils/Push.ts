// src/push.ts

import { serverURL, token } from '$lib/Store';
import type { SubscriptionObject } from '$lib/types/Push';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function subscribeUserToPush(
	toastStore: ToastStore
): Promise<PushSubscription | null> {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		try {
			const applicationServerKey = await getPublicVapidKey(toastStore);
			const registration = await navigator.serviceWorker.ready;

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
			});

			const SubscriptionObject: SubscriptionObject = {
				type: 'web',
				subscription: subscription.toJSON() as {
					endpoint: string;
					expirationTime: number | null;
					keys: {
						p256dh: string | ArrayBuffer | null;
						auth: string | ArrayBuffer | null;
					};
				}
			};

			await sendSubscriptionToBackEnd(SubscriptionObject, toastStore);

			return subscription;
		} catch (error) {
			return null;
		}
	}
	return null;
}

async function sendSubscriptionToBackEnd(
	subscription: SubscriptionObject,
	toastStore: ToastStore
): Promise<void> {
	const response = await fetch(`${get(serverURL)}/push/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		},
		body: JSON.stringify(subscription)
	});

	if (response.status !== 201) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.any'));
	}
}

async function getPublicVapidKey(toastStore: ToastStore): Promise<string> {
	const response = await fetch(`${get(serverURL)}/push/vapid`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});
	const keyObjekt = await response.json();
	if (response.status === 200) {
		return await keyObjekt.key;
	} else {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.push'));
		throw new Error('Failed to get public vapid key');
	}
}
