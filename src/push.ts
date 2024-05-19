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
			//const applicationServerKey = 'BGB6mz3FS_1nvXCsuS0rJ5Cm6RQdAduvc3oecjzHiEU0e1K1pDClKbnaVYT8PpQYKkuaR4KZEbq5qj8PuZ7DI-4';
			const applicationServerKey = await getPublicVapidKey();
			const registration = await navigator.serviceWorker.ready;

			//console.log('Service Worker is ready:', registration);
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
			});

			const SubscriptionObject: SubscriptionObject = {
				type: 'web',
				subscription: {
                    endpoint: subscription.endpoint,
					p256dh: subscription.getKey('p256dh')!.toString(),
					auth: subscription.getKey('auth')!.toString()
				}
			};

			console.log('Subscription Object:', SubscriptionObject);
			await sendSubscriptionToBackEnd(SubscriptionObject);

			return subscription;
		} catch (error) {
			console.error('Failed to subscribe the user: ', error);
			return null;
		}
	}
	return null;
}

async function sendSubscriptionToBackEnd(subscription: SubscriptionObject): Promise<void> {
	console.log('Sending subscription to the backend');
	const response = await fetch(`${get(serverURL)}/push/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		},
		body: JSON.stringify(subscription)
	});

	if (response.status === 201) {
		console.log('Subscription was sent to the backend');
	} else {
		console.error('Failed to send subscription to the backend');
	}
}

async function getPublicVapidKey(): Promise<string> {
	const response = await fetch(`${get(serverURL)}/push/vapid`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${get(token)}`
		}
	});

	if (response.status === 200) {
		return await response.text();
	} else {
		throw new Error('Failed to get public vapid key');
	}
}
