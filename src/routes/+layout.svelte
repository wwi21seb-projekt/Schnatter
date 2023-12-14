<script lang="ts">
	import '../app.postcss';

	import Navbar from '../components/Navbar.svelte';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<AppShell>
	<svelte:fragment slot="header"><Navbar /></svelte:fragment>
	<slot />
</AppShell>
