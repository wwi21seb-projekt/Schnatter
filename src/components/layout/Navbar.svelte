<!-- App Header -->

<script lang="ts">
	import {
		AppBar,
		getModalStore,
		getToastStore,
		popup,
		type ModalSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { get } from 'svelte/store';
	import { notificationCount, notificationList, token } from '$lib/Store';
	import { t } from '../../i18n';
	import Settings from '../popups/Settings.svelte';
	import Notifications from '../popups/Notifications.svelte';
	import { createNotificationToast } from '$lib/utils/Toasts';
	import { logout } from '$lib/utils/Logout';
	const loginToken = get(token);

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const modalPost: ModalSettings = {
		type: 'component',
		component: 'modalCreatePost'
	};

	const modalChat: ModalSettings = {
		type: 'component',
		component: 'modalChat'
	};
	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	const popupNotifications: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupNotifications',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
		closeQuery: '#will-close'
	};

	function handleLogout() {
		logout();
	}
	function openModalPost() {
		modalStore.trigger(modalPost);
	}
	function openModalChat() {
		modalStore.trigger(modalChat);
	}
	function gotoProfile() {
		window.location.href = '/profile';
	}
	// Icon Sound
	function play() {
		var audio = new Audio('quack.mp3');
		audio.play();
	}
	// Service Worker Push Notification
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		// Listen for messages from service worker
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
				const payload = event.data.payload;

				const notifications = get(notificationList);
				if (
					notifications.records.some(
						(notification) => notification.notificationId === payload.notificationId
					)
				) {
					return;
				} else {
					notificationList.update((value) => {
						value.records.push(payload);

						return value;
					});
					notificationCount.update((value) => value + 1);
					toastStore.trigger(createNotificationToast(payload));
				}
			}
		});
	}
</script>

<!--header components that can be seen on every page-->
<AppBar zIndex="9" class="fixed top-0 left-0 right-0">
	<svelte:fragment slot="lead">
		<!--on the respective icon is always the redirection to the page-->
		<div style="gap: 1rem; display: flex; align-items: center;">
			<a href="/" on:click={play} on:keyup={play}>
				<img class="w-11 h-11" src="/Schnatter_Logo.webp" alt="Schnatter Logo Header" />
			</a>
			<a href="/"><h1 class="text-4xl">Schnatter</h1> </a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<a href="/" data-sveltekit-preload-data="hover" title={$t('navbar.home')}>
				<Icon class="w-10 h-10" icon="clarity:home-line" />
			</a>
			{#if loginToken != ''}
				<!--some functions are only displayed when you are logged in-->
				<a href="/search/users" data-sveltekit-preload-data="hover" title={$t('navbar.search')}>
					<Icon class="w-10 h-10" icon="clarity:search-line" />
				</a>
				<button on:click={openModalPost} title={$t('navbar.posts')}>
					<Icon class="w-10 h-10" icon="clarity:add-line" />
				</button>
				<button
					on:click={openModalChat}
					data-sveltekit-preload-data="hover"
					title={$t('navbar.messages')}
				>
					<Icon class="w-10 h-10" icon="clarity:chat-bubble-line" />
				</button>
				<button on:click={gotoProfile} title={$t('navbar.profile')}>
					<Icon class="w-10 h-10" icon="clarity:user-line" style="font-size: 32px" />
				</button>
				<button use:popup={popupNotifications} title={$t('navbar.notifications')}>
					<div class="relative inline-block">
						<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10"
							>{$notificationCount}</span
						>
						<Icon class="w-10 h-10" icon="clarity:notification-line" style="font-size: 32px" />
					</div>
				</button>
			{/if}
			<button class="" use:popup={popupFeatured} title={$t('navbar.settings')}>
				<Icon class="w-10 h-10" icon="clarity:settings-line" />
			</button>
			{#if loginToken != ''}
				<button on:click={handleLogout} title={$t('navbar.logout')}>
					<Icon class="w-10 h-10" icon="clarity:logout-line" style="font-size: 32px" /></button
				>
			{/if}
		</div>
	</svelte:fragment>
	<div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
		<Settings />
	</div>
	<div id="wont-close" class="card p-4 w-[20vw] shadow-xl" data-popup="popupNotifications">
		<Notifications />
	</div>
</AppBar>
