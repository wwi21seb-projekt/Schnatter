/// <reference types="@sveltejs/kit" />
import type { NotificationEntity } from '$lib/types/notifications';

self.addEventListener('fetch', function () {
	return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function (event: any) {
	// TODO: Handle push event
	const payload: NotificationEntity = event.data?.json() ?? 'no payload';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	self.clients.matchAll().then((clients) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		clients.forEach((client) => {
			client.postMessage({
				type: 'PUSH_NOTIFICATION',
				payload: payload
			});
		});
	});
} as EventListener);
