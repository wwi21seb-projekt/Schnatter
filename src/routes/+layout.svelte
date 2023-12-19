<script lang="ts">
	import '../app.postcss';

	import Navbar from '../components/navbar.svelte';
	import Footer from '../components/Footer.svelte';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<AppShell>
	<svelte:fragment slot="header"><Navbar /></svelte:fragment>
	<slot />
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
