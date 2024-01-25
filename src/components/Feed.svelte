<script lang="ts">
	import Post from './Post.svelte';
	import { onMount } from 'svelte';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { token, serverURL } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { loadMorePosts, fetchPosts } from '$lib/FeedFunctions';
	import { posts, maxPostCounter, slotLimit, hasMorePosts } from '$lib/FeedDataStore';

	const toastStore = getToastStore();
	export let pageType = 'home';

	async function onLoadMorePosts() {
		const loginToken = get(token);
		const serverUrl = get(serverURL);
		await loadMorePosts(loginToken, serverUrl, toastStore, pageType);
	}

	onMount(async () => {
		const loginToken = get(token);
		const url = get(serverURL);
		if (pageType === 'home') {
			if (loginToken !== '') {
				fetchPosts(true, url, toastStore);
			} else {
				fetchPosts(false, url, toastStore);
			}
		} else if (pageType === 'search') {
		}
	});
</script>

<main class="flex flex-col items-center">
	{#each $posts as postData (postData.postId)}
		<Post {postData} />
	{/each}
	{#if $maxPostCounter % slotLimit == 0 && $hasMorePosts && $posts.length > 0}
		<button on:click={onLoadMorePosts} class="btn variant-filled w-full md:w-auto py-2 px-4"
			>{$t('profile.loadMore')}</button
		>
	{/if}
	<Toast />
</main>
