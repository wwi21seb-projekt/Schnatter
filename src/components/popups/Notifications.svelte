<script lang="ts">
	import { Avatar, LightSwitch, getToastStore } from '@skeletonlabs/skeleton';
	import { locale, t } from '../../i18n';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { Notifications } from '$lib/types/notifications';
	import Icon from '@iconify/svelte';
	import { createToast } from '$lib/Toasts';
	import { deleteNotificationRequest } from '$lib/utils/Notifications';
	import { notificationCount } from '$lib/Store';
	import { goto } from '$app/navigation';

	let language = '';
	const toastStore = getToastStore();

	onMount(() => {
		language = get(locale);
	});

	let notifications: Notifications = {
		records: [
			{
				notificationId: '5af04939-7cd5-4bb8-aea1-60a6785188f3',
				timestamp: '',
				notificationType: 'follow', // follow, repost,
				user: {
					username: 'mabu2807',
					nickname: '',
					profilePictureUrl: ''
				}
			},
			{
				notificationId: '866bea46-e71b-4c68-a67c-c34a0908b4ef',
				timestamp: '',
				notificationType: 'repost', // follow, repost,
				user: {
					username: 'tina',
					nickname: '',
					profilePictureUrl: ''
				}
			}
            ,
			{
				notificationId: '866bea46-e71b-4c68-a67c-c34a0908b356',
				timestamp: '',
				notificationType: 'repost', // follow, repost,
				user: {
					username: 'tina',
					nickname: '',
					profilePictureUrl: ''
				}
			}
		]
	};
	notificationCount.set(notifications.records.length);

	//function create

	function getNotificationType(notificationType: string) {
		switch (notificationType) {
			case 'follow':
				return get(t)('notifications.follow');
			case 'repost':
				return get(t)('notifications.repost');
			default:
				return get(t)('notifications.default');
		}
	}
	async function deleteNotification(notificationId: string) {
		//const response = await deleteNotificationRequest(notificationId);
		const response = true;
		if (response) {
			notifications = deleteNotificationById(notifications, notificationId);
		}
	}

	function deleteNotificationById(
		notifications: Notifications,
		notificationId: string
	): Notifications {
		const updatedRecords = notifications.records.filter(
			(notification) => notification.notificationId !== notificationId
		);
		console.log(updatedRecords);
		notificationCount.set(updatedRecords.length);
		console.log(get(notificationCount));
		return {
			...notifications,
			records: updatedRecords
		};
	}
</script>

<main class="flex flex-col justify-center p-2 w-[18vw]">
	<ul class="list">
		{#each notifications.records as notification (notification.notificationId)}
			<button
				title={$t('notifications.tooltip.delete')}
				class=" flex flex-row w-full h-full justify- items-center"
				on:click={() => deleteNotification(notification.notificationId)}
			>
				<Avatar class="w-9 h-9" initials={notification.user.username.substring(0, 2)} />
				<span class="flex-auto font-bold"
					>"<button
						title={$t("notifications.tooltip.goToProfile")}
						class="text-green-500"
						on:click={() => goto(`/profile?username=${notification.user.username}`)}
						>{notification.user.nickname || notification.user.username}</button
					>"{' ' + getNotificationType(notification.notificationType)}</span
				>
			</button>
			{#if notifications.records.length !== 0 && !(notification === notifications.records[notifications.records.length - 1])}
				<hr class="!border-t-2" />
			{/if}
		{/each}
		{#if notifications.records.length === 0 }
			<p>{$t('notifications.noNotifications')}</p>
		{/if}
	</ul>
</main>
