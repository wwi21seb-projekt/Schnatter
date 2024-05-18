<script lang="ts">
	import {
		AppBar,
		getModalStore,
		popup,
		type ModalSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { get } from 'svelte/store';
	import { notificationCount, refreshToken, token } from '$lib/Store';
	import { t } from '../../i18n';
	import Settings from '../popups/Settings.svelte';
	import Notifications from '../popups/Notifications.svelte';
	const loginToken = get(token);

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalCreatePost'
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
		token.set('');
		refreshToken.set('');
		location.reload();
	}
	function openModal() {
		modalStore.trigger(modal);
	}
	function gotoProfile() {
		window.location.href = '/profile';
	}

	function play() {
		var audio = new Audio('quack.mp3');
		audio.play();
	}
</script>

<AppBar>
	<svelte:fragment slot="lead">
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
				<Icon class="w-10 h-10" icon="mdi:home" />
			</a>
			{#if loginToken != ''}
				<a href="/search/users" data-sveltekit-preload-data="hover" title={$t('navbar.search')}>
					<Icon class="w-10 h-10" icon="material-symbols:search" />
				</a>
				<button on:click={openModal} title={$t('navbar.posts')}>
					<Icon class="w-10 h-10" icon="gridicons:add" />
				</button>
				<a href="/messages" data-sveltekit-preload-data="hover" title={$t('navbar.messages')}>
					<Icon class="w-10 h-10" icon="mdi:message-bubble" />
				</a>
				<button on:click={gotoProfile} title={$t('navbar.profile')}>
					<Icon class="w-10 h-10" icon="clarity:user-solid" style="font-size: 32px" />
				</button>
				{#if get(notificationCount) > 0}
					<button use:popup={popupNotifications} title={$t('navbar.notifications')}>
						<div class="relative inline-block">
							<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10"
								>{$notificationCount}</span
							>
							<Icon class="w-10 h-10" icon="clarity:notification-solid" style="font-size: 32px" />
						</div>
					</button>
				{:else}
					<button use:popup={popupNotifications} title={$t('navbar.notifications')}>
						<Icon class="w-10 h-10" icon="clarity:notification-solid" style="font-size: 32px" />
					</button>
				{/if}
			{/if}
			<button class="" use:popup={popupFeatured} title={$t('navbar.settings')}>
				<Icon class="w-10 h-10" icon="material-symbols:settings" />
			</button>
			{#if loginToken != ''}
				<button on:click={handleLogout} title={$t('navbar.logout')}>
					<Icon class="w-10 h-10" icon="ic:baseline-logout" style="font-size: 32px" /></button
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
