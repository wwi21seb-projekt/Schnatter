<script lang="ts">
	import { AppBar, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	const loginToken = get(token);

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalCreatePost'
	};

	function handleLogout() {
		token.set('');
		location.reload();
	}
	function openModal() {
		modalStore.trigger(modal);
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
				<Icon class="w-10 h-10" icon="mdi:home" style="font-size: 32px"/>
			</a>
			{#if loginToken != ''}
				<a href="/search/users" title="search">
					<Icon class="w-10 h-10" icon="ic:round-search" style="font-size: 32px" />
				</a>
				<button on:click={openModal} title="post">
					<Icon class="w-10 h-10" icon="gridicons:add" style="font-size: 32px" />
				</button>
				<a href="/messages" title="messages">
					<Icon class="w-10 h-10" icon="entypo:message" style="font-size: 32px" />
				</a>
				<a href="/profile" title="profile">
					<Icon class="w-10 h-10" icon="gg:profile" style="font-size: 32px" />
				</a>
				<button on:click={handleLogout} title="logOut">
					<Icon class="w-10 h-10" icon="ic:baseline-logout" style="font-size: 32px" /></button
				>
			{/if}
		</div>
	</svelte:fragment>
</AppBar>
