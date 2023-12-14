<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { token } from '$lib/Store';
	let loginToken;
	token.subscribe((prev_val) => (loginToken = prev_val));
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<h1 style="font-size: 32px">Schnatter</h1>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<a href="/">
			<Icon class="w-10 h-10" icon="mdi:home" style="font-size: 32px" />
		</a>
		<a href="/search">
			<Icon class="w-10 h-10" icon="ic:round-search" style="font-size: 32px" />
		</a>
		{#if loginToken != ''}
			<a href="/post">
				<Icon class="w-10 h-10" icon="gridicons:add" style="font-size: 32px" />
			</a>
			<a href="/messages">
				<Icon class="w-10 h-10" icon="entypo:message" style="font-size: 32px" />
			</a>
			<a href="/profile">
				<Icon class="w-10 h-10" icon="gg:profile" style="font-size: 32px" />
			</a>
		{/if}
	</svelte:fragment>
</AppBar>
