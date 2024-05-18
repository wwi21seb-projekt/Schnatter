self.addEventListener('fetch', function () {
	return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function (event: any) {
	const payload = event.data?.text() ?? 'no payload';

	console.log('Push received', payload);

	
	
} as EventListener);
