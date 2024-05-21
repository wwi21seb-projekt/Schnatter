// src/push.ts

import { serverURL, token } from '$lib/Store';
import type { SubscriptionObject } from '$lib/types/Push';
import { get } from 'svelte/store';

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

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		try {
			const applicationServerKey = await getPublicVapidKey();
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

			await sendSubscriptionToBackEnd(SubscriptionObject);

			// Passen Sie den Pfad an Ihre tatsächliche Struktur an

			return subscription;
		} catch (error) {
			return null;
		}
	}
	return null;
}

async function sendSubscriptionToBackEnd(subscription: SubscriptionObject): Promise<void> {
	const response = await fetch(`${get(serverURL)}/push/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		},
		body: JSON.stringify(subscription)
	});

	if (response.status !== 201) {
		throw new Error('Failed to send subscription to backend');
	}
}

async function getPublicVapidKey(): Promise<string> {
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
		throw new Error('Failed to get public vapid key');
	}
}
