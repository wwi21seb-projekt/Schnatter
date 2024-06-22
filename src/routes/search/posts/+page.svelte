<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { token } from '$lib/Store';
	import { t } from '../../../i18n';
	import type { Feed as FeedStructure } from '$lib/types/Feed';
	import Feed from '../../../components/Feed.svelte';
	import { manageSession } from '$lib/utils/Session';
	import { searchPostsByHashtag } from '$lib/utils/SearchPosts';

	let focusfield: HTMLInputElement;
	let lastInput = '';
	let slotLimit = 10;
	let feedData: FeedStructure = {
		records: [],
		pagination: {
			lastPostId: '',
			limit: slotLimit,
			records: 0
		}
	};
	const toastStore = getToastStore();
	const loginToken = get(token);

	async function handleHashtagInput(event: Event) {
		let hashtagInput = (event.target as HTMLInputElement).value;
		if (hashtagInput.startsWith('#')) {
			hashtagInput = hashtagInput.substring(1);
		}
		lastInput = hashtagInput;
		// resetting the feed data before each new search
		if (hashtagInput.length > 0) {
			feedData = {
				records: [],
				pagination: {
					lastPostId: '',
					limit: slotLimit,
					records: 0
				}
			};
		}

		if (hashtagInput.length > 0) {
			const result = await searchPostsByHashtag(
				loginToken,
				toastStore,
				hashtagInput,
				feedData,
				feedData.pagination.lastPostId,
				slotLimit
			);
			feedData = result.feedData;
		}
	}

	async function onLoadMorePosts() {
		const result = await searchPostsByHashtag(
			loginToken,
			toastStore,
			lastInput,
			feedData,
			feedData.pagination.lastPostId,
			slotLimit
		);
		feedData = result.feedData;
	}

	onMount(async () => {
		manageSession();
		focusfield.focus();
	});
</script>

<main>
	<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
		<div class="mb-8 flex justify-center items-center gap-4">
			<a href="/search/users">
				<Icon class="w-10 h-10" icon="mdi:account-search-outline" style="font-size: 32px" />
			</a>
			<a href="/search/posts">
				<Icon
					class="w-10 h-10 text-primary-500"
					icon="mdi:text-box-search"
					style="font-size: 32px; border: 2px solid; border-radius: 5px;"
				/>
			</a>
		</div>
		<input
			class="input w-full"
			type="search"
			name="hashtag"
			placeholder={$t('post.search.placeholder')}
			on:input={handleHashtagInput}
			bind:this={focusfield}
		/>
		<div class="mt-4 w-full"></div>
		{#if feedData.records.length > 0}
			<Feed {feedData} />
		{:else}
			<p class="text-center text-gray-500" title="noResultText">{$t('search.posts.noResults')}</p>
		{/if}
	</div>
	<div class="pb-8 flex flex-row justify-center items-start">
		{#if feedData.records.length < feedData.pagination.records}
			<button on:click={onLoadMorePosts} class="btn variant-filled w-full md:w-auto py-2 px-4"
				>{$t('profile.loadMore')} ({feedData.records.length}/{feedData.pagination.records})</button
			>
		{/if}
	</div>
</main>
