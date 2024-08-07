<!-- Notification popup Navbar -->
<script lang="ts">
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import { get } from 'svelte/store';
	import type { Notifications } from '$lib/types/Notifications';
	import { deleteNotificationRequest, getNotificationsRequest } from '$lib/utils/Notifications';
	import { notificationCount, notificationList, token } from '$lib/Store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	const toastStore = getToastStore();
	onMount(async () => {
		let notificationListUpdate: Notifications = { records: [] };
		if (get(token)) {
			notificationListUpdate = (await getNotificationsRequest(toastStore)) ?? {
				records: []
			};
		}
		notificationList.set(notificationListUpdate);
		notificationCount.set(notificationListUpdate.records.length);
	});

	function getNotificationType(notificationType: string) {
		switch (notificationType) {
			case 'follow':
				return get(t)('notifications.follow');
			case 'repost':
				return get(t)('notifications.repost');
			case 'message':
				return get(t)('notifications.message');
			default:
				return get(t)('notifications.default');
		}
	}
	async function deleteNotification(notificationId: string) {
		const response = await deleteNotificationRequest(notificationId, toastStore);

		if (response) {
			notificationList.set(deleteNotificationById(get(notificationList), notificationId));
		}
	}

	function deleteNotificationById(
		notifications: Notifications,
		notificationId: string
	): Notifications {
		const updatedRecords = notifications.records.filter(
			(notification) => notification.notificationId !== notificationId
		);
		notifications.records = updatedRecords;

		notificationCount.set(updatedRecords.length);
		notificationList.set(notifications);
		return {
			...notifications,
			records: updatedRecords
		};
	}
</script>

<main class="flex flex-col justify-center w-[18vw] max-h-72 overflow-auto">
	<ul class="list m-2">
		{#each $notificationList.records as notification}
			<button
				title={$t('notifications.tooltip.delete')}
				class=" flex flex-row w-full h-full justify- items-center"
				on:click={() => deleteNotification(notification.notificationId)}
			>
				<Avatar class="w-9 h-9" initials={notification.user.username.substring(0, 2)} />
				<span class="flex-auto font-bold"
					>"<button
						title={$t('notifications.tooltip.goToProfile')}
						class="text-green-500"
						on:click={() => goto(`/profile?username=${notification.user.username}`)}
						>{notification.user.nickname || notification.user.username}</button
					>"{' ' + getNotificationType(notification.notificationType)}</span
				>
			</button>
			{#if $notificationList.records.length !== 0 && !(notification === $notificationList.records[$notificationList.records.length - 1])}
				<hr class="!border-t-2" />
			{/if}
		{/each}
		{#if $notificationList.records.length === 0}
			<div class="flex justify-center items-center">
				<p>{$t('notifications.noNotifications')}</p>
			</div>
		{/if}
	</ul>
</main>
