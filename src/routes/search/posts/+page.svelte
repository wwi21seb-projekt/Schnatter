<script lang="ts">
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { token, serverURL } from '$lib/Store';
	import { goto } from '$app/navigation';
	import { t } from '../../../i18n';
	import Feed from '../../../components/Feed.svelte';
	import { resetPostsAndFeedData, searchHashtagPosts } from '$lib/FeedFunctions';
	import { posts, feedData, pageType } from '$lib/FeedDataStore';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		posts.set([]);
		feedData.set({
			records: [],
			pagination: {
				lastPostId: '',
				limit: 10,
				records: 0
			}
		});
	});
	let prevInput = '';
	let characterRemoved = false;

	const toastStore = getToastStore();

	const serverUrl = get(serverURL);

	async function handleHashtagInput(event: Event) {
		let hashtagInput = (event.target as HTMLInputElement).value;

		if (hashtagInput.length > prevInput.length) {
			characterRemoved = false;
		} else if (hashtagInput.length < prevInput.length) {
			characterRemoved = true;
		}
		prevInput = hashtagInput;

		if (hashtagInput.length > 0) {
			searchHashtagPosts(serverUrl, toastStore, hashtagInput, characterRemoved);
		}
		// is search term is completely removed, do not show any posts
		else {
			resetPostsAndFeedData();
		}
	}

	onMount(async () => {
		if (get(token) == '') {
			goto('/');
		}
		pageType.set('search');
		resetPostsAndFeedData();
	});
</script>

<main>
	<Toast />
	<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
		<div class="mb-8 flex justify-center items-center gap-4">
			<a href="/search/users">
				<Icon class="w-10 h-10" icon="mdi:account-search-outline" style="font-size: 32px" />
			</a>
			<a href="/search/posts">
				<Icon
					class="w-10 h-10"
					icon="mdi:text-box-search"
					style="font-size: 32px; border: 2px solid; border-radius: 5px;"
				/>
			</a>
		</div>
		<input
			class="input w-full"
			type="search"
			name="hashtag"
			placeholder="Search a hashtag..."
			on:input={handleHashtagInput}
		/>
		<div class="mt-4 w-full"></div>
		{#if $posts.length > 0}
			<Feed pageType="search" />
		{:else}
			<p class="text-center text-gray-500" title="noResultText">{$t('search.posts.noResults')}</p>
		{/if}
	</div>
</main>
