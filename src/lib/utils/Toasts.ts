import type { NotificationEntity } from '$lib/types/Notifications';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';
import { get } from 'svelte/store';

export function createToast(message: string, background: string) {
	const toast: ToastSettings = {
		message: message,
		timeout: 20000,
		background: 'variant-filled-' + background,
		classes: 'z-10000'
	};
	return toast;
}

export function createNotificationToast(payload: unknown) {
	//all notifications are checked for their content and based on this there are the toast displays for the users
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
		background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
		classes: 'z-10000'
	};
	return toast;
}
