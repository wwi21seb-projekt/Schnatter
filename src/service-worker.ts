/// <reference types="@sveltejs/kit" />

self.addEventListener('fetch', function () {
	return;
});

//Eventlistener for push Events in the Service Worker

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function (event: any) {
	const payload = event.data?.json() ?? 'no payload';
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
