<script lang="ts">
	import Post from './Post.svelte';
	import type { Feed as FeedStructure } from '$lib/types/Feed';

	export let feedData: FeedStructure;
</script>

<main class="flex flex-col items-center">
	{#each feedData.records as postData (postData.postId)}
		<Post bind:postData currentUsername={postData.author?.username} />
	{/each}
</main>
