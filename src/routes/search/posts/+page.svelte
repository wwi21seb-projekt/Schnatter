<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { serverURL } from '$lib/Store';
	import type { PostStructure } from '$lib/types/Post';

    initializeStores();
	const toastStore = getToastStore();

    let response: Response;
	let hashtagInput: string;
	let serverUrl: string;
	let statusCode: number = 0;
	let posts: Array<PostStructure> = [];

    async function handleHashtagInput(event: Event) {
    }
</script>

<Toast />
<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
	<div class="mb-8" style="gap: 1rem; display: flex; justify-content: center; align-items: center;">
		<a href="/search/users">
			<Icon class="w-10 h-10" icon="mdi:account-search-outline" style="font-size: 32px" />
		</a>
		<a href="/search/posts">
			<Icon class="w-10 h-10" icon="mdi:text-box-search" style="font-size: 32px" />
		</a>
	</div>
	<input
		class="input w-full"
		type="search"
		name="hashtag"
		on:input={handleHashtagInput}
		placeholder="Search a hashtag..."
	/>
	<div class="mt-4 w-full">
		
	</div>
</div>