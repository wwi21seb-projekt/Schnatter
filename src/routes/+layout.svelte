<script lang="ts">
	import '../app.postcss';

	import Navbar from '../components/navbar.svelte';
	import Footer from '../components/Footer.svelte';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, Modal, storePopup, type ModalComponent } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores } from '@skeletonlabs/skeleton';
	import ModalCreatePost from '../components/ModalCreatePost.svelte';
	initializeStores();
	const modalRegistry: Record<string, ModalComponent> = {
		modalCreatePost: { ref: ModalCreatePost }
	};
</script>

<Modal components={modalRegistry} />
<AppShell>
	<svelte:fragment slot="header"><Navbar /></svelte:fragment>
	<slot />
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
