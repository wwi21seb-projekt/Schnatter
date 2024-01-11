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
			<Icon class="w-10 h-10" icon="game-icons:kiwi-bird" style="font-size: 32px" />
			<a href="/"><h1 style="font-size: 32px">Schnatter</h1></a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<a href="/">
				<Icon class="w-10 h-10" icon="mdi:home" style="font-size: 32px" />
			</a>
			<a href="/search/users">
				<Icon class="w-10 h-10" icon="ic:round-search" style="font-size: 32px" />
			</a>
			{#if loginToken != ''}
				<button on:click={openModal}>
					<Icon class="w-10 h-10" icon="gridicons:add" style="font-size: 32px" />
				</button>
				<a href="/messages">
					<Icon class="w-10 h-10" icon="entypo:message" style="font-size: 32px" />
				</a>
				<a href="/profil">
					<Icon class="w-10 h-10" icon="gg:profile" style="font-size: 32px" />
				</a>
				<button on:click={handleLogout}
					><Icon class="w-10 h-10" icon="ic:baseline-logout" style="font-size: 32px" /></button
				>
			{/if}
		</div>
	</svelte:fragment>
</AppBar>
