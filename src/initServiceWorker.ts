// initServiceWorker.js

import { notificationCount, notificationList } from '$lib/Store';
import { get } from 'svelte/store';
// Passen Sie den Pfad an Ihre tatsächliche Struktur an

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
			const payload = event.data.payload;
			const notifications = get(notificationList);
			notifications.records.push(payload);
			notificationList.set(notifications);
			notificationCount.set(notifications.records.length);

			console.log('Push notification received in main application', payload);
		}
	});
}
