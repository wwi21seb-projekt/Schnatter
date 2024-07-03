import type { NotificationEntity } from '$lib/types/Notifications';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';
import { get } from 'svelte/store';

export function createToast(message: string, background: string) {
	const toast: ToastSettings = {
		message: message,
		timeout: 20000,
		background: 'variant-filled-' + background
	};
	return toast;
}

export function createNotificationToast(payload: unknown) {
	const notifications = payload as NotificationEntity;
	let message = '';
	switch (notifications.notificationType) {
		case 'message': {
			message = get(t)('toast.notifications.message') + ' ' + notifications.user.username;
			break;
		}
		case 'repost': {
			message = notifications.user.username + ' ' + get(t)('toast.notifications.repost');
			break;
		}
		case 'follow': {
			message = notifications.user.username + ' ' + get(t)('toast.notifications.follow');
			break;
		}
		default: {
			message = get(t)('');
			break;
		}
	}
	const toast: ToastSettings = {
		message: message,
		timeout: 20000,
		background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white'
	};
	return toast;
}
