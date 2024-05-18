// src/push.ts

const applicationServerKey = 'BGB6mz3FS_1nvXCsuS0rJ5Cm6RQdAduvc3oecjzHiEU0e1K1pDClKbnaVYT8PpQYKkuaR4KZEbq5qj8PuZ7DI-4';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
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
            const registration = await navigator.serviceWorker.ready;

            console.log('Service Worker is ready:', registration);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
            });

            console.log('User is subscribed:', subscription);



            //hier api fetch an Backend

            return subscription;
        } catch (error) {
            console.error('Failed to subscribe the user: ', error);
            return null;
        }
    }
    return null;
}
