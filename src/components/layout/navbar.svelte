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
	import { token } from '$lib/Store';
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
		location.reload();
	}
	function openModal() {
		modalStore.trigger(modal);
	}
	function gotoProfile() {
		window.location.href = '/profile';
	}
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<img class="w-11 h-11" src="/Schnatter_Logo.webp" alt="Schnatter Logo Header" />
			<a href="/"><h1 class="text-4xl">Schnatter</h1></a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<a href="/" title="home">
				<Icon class="w-10 h-10" icon="mdi:home" />
			</a>
			{#if loginToken != ''}
				<a href="/search/users" title="search">
					<Icon class="w-10 h-10" icon="ic:round-search" />
				</a>
				<button on:click={openModal} title="post">
					<Icon class="w-10 h-10" icon="gridicons:add" />
				</button>
				<a href="/messages" title="messages">
					<Icon class="w-10 h-10" icon="entypo:message" />
				</a>
				<button on:click={gotoProfile}>
					<Icon class="w-10 h-10" icon="gg:profile" style="font-size: 32px" />
				</button>
				<button class="" use:popup={popupFeatured}
					><Icon class="w-10 h-10" icon="material-symbols:settings" /></button
				>
				{#if loginToken != ''}
					<button on:click={handleLogout} title="logOut">
						<Icon class="w-10 h-10" icon="ic:baseline-logout" style="font-size: 32px" /></button
					>
				{/if}
			{/if}
		</div>
	</svelte:fragment>
	<div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
		<Settings />
	</div>
</AppBar>
