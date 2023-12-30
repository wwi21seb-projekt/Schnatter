<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';

	import ModalCreatePost from './ModalCreatePost.svelte';
	const loginToken = get(token);

	let showModal = false;

	function handleLogout() {
		token.set('');
		location.reload();
	}
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<Icon class="w-10 h-10" icon="game-icons:kiwi-bird" style="font-size: 32px" />
			<h1 style="font-size: 32px">Schnatter</h1>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div style="gap: 1rem; display: flex; align-items: center;">
			<a href="/">
				<Icon class="w-10 h-10" icon="mdi:home" style="font-size: 32px" />
			</a>
			<a href="/search">
				<Icon class="w-10 h-10" icon="ic:round-search" style="font-size: 32px" />
			</a>
			{#if loginToken != ''}
				<button>
					<Icon class="w-10 h-10" icon="gridicons:add" style="font-size: 32px" on:click={()=>(showModal = true)} />
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
