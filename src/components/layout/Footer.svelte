<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<img
			class="w-10 h-10"
			src="/Schnatter_Logo.webp"
			alt="Schnatter Logo"
			style="font-size: 32px"
		/>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<a href="/imprint">Impressum</a>
	</svelte:fragment>
</AppBar>
