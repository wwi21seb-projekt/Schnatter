<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { serverURL, token } from '$lib/Store';
	import ChangeFeedTypeButton from '../components/ChangeFeedTypeButton.svelte';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { fetchPosts } from '$lib/FeedFunctions';

	const toastStore = getToastStore();

	const loginToken = get(token);
	onMount(async () => {
		const loginToken = get(token);
		const url = get(serverURL);
		if (loginToken !== '') {
			fetchPosts(true, url, toastStore);
		} else {
			fetchPosts(false, url, toastStore);
		}
	});
</script>

<main class="">
	<div class="float-right mr-12">
		{#if loginToken == ''}
			<Login />
		{/if}
	</div>

	<div class="p-2 flex flex-row justify-center items-start">
		<ChangeFeedTypeButton />
	</div>
	<div class="p-2 flex flex-row justify-center items-start">
		<Feed pageType="home" />
	</div>
</main>
