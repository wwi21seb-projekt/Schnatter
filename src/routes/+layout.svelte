<script lang="ts">
	import '../app.postcss';

	import Navbar from '../components/layout/Navbar.svelte';
	import Footer from '../components/layout/Footer.svelte';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, Modal, Toast, storePopup } from '@skeletonlabs/skeleton';
	import { type ModalComponent } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores } from '@skeletonlabs/skeleton';
	import ModalCreatePost from '../components/modals/ModalCreatePost.svelte';
	import ModalChat from '../components/modals/ModalChat.svelte';
	import ModalNewChat from '../components/modals/ModalNewChat.svelte';
	import ModalChangeProfilePicture from '../components/modals/ModalChangeProfilePicture.svelte';
	initializeStores();
	const modalRegistry: Record<string, ModalComponent> = {
		modalCreatePost: { ref: ModalCreatePost },
		modalChat: { ref: ModalChat },
		modalBeginChat: { ref: ModalNewChat },
		modalProfilePicture: { ref: ModalChangeProfilePicture }
	};
</script>

<Toast zIndex="1100" />
<Modal zIndex="1000" components={modalRegistry} />
<AppShell>
	<svelte:fragment slot="header"><Navbar /></svelte:fragment>
	<slot />
	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
