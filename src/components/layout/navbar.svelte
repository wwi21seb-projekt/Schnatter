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
	import { refreshToken, token } from '$lib/Store';
	import { t } from '../../i18n';
	import Settings from '../popups/Settings.svelte';
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
			<a href="/" title={$t('navbar.home')}>
				<Icon class="w-10 h-10" icon="mdi:home" />
			</a>
			{#if loginToken != ''}
				<a href="/search/users" title={$t('navbar.search')}>
					<Icon class="w-10 h-10" icon="material-symbols:search" />
				</a>
				<button on:click={openModal} title={$t('navbar.posts')}>
					<Icon class="w-10 h-10" icon="gridicons:add" />
				</button>
				<a href="/messages" title={$t('navbar.messages')}>
					<Icon class="w-10 h-10" icon="mdi:message-bubble" />
				</a>
				<button on:click={gotoProfile} title={$t('navbar.profile')}>
					<Icon class="w-10 h-10" icon="clarity:user-solid" style="font-size: 32px" />
				</button>
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
</AppBar>
