<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<Icon class="w-10 h-10" icon="game-icons:kiwi-bird" style="font-size: 32px" />
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<a href="/impressum">Impressum</a>
	</svelte:fragment>
</AppBar>
