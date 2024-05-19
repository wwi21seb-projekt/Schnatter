self.addEventListener('fetch', function () {
	return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function (event: any) {
	// TODO: Handle push event
	const payload = event.data?.json() ?? 'no payload';

	console.log('Push received', payload);
} as EventListener);
