import type { ToastSettings } from '@skeletonlabs/skeleton';

export function createToast(message: string, background: string) {
	const toast: ToastSettings = {
		message: message,
		timeout: 20000,
		background: 'variant-filled-' + background
	};
	return toast;
}
