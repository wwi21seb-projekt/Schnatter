<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	const loginToken = get(token);

	function handleLogout() {
		token.set('');
		location.reload();
	}
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<Icon class="w-10 h-10" icon="game-icons:kiwi-bird" style="font-size: 32px" />
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<a href="/impressum">Impressum</a>
	</svelte:fragment>
</AppBar>
