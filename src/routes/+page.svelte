<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { token } from '$lib/Store';
	import { onMount } from 'svelte';
	import { RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { Feed as FeedStructure } from '$lib/types/Feed';
	import { fetchPosts } from '../lib/FeedPosts';
	import { t } from '../i18n';

	let slotLimit = 10;
	let feedType = 'global';
	let feedData: FeedStructure = {
		records: [],
		pagination: {
			lastPostId: '',
			limit: slotLimit,
			records: 0
		}
	};
	let isPersonalFeed: boolean = false; // FeedType: true = personal, false = global

	const toastStore = getToastStore();
	const loginToken = get(token);
	let result;

	onMount(async () => {
		if (loginToken !== '') {
			result = await fetchPosts(loginToken, toastStore, feedData, slotLimit, feedType);
			feedData = result.feedData;
		} else {
			result = await fetchPosts(loginToken, toastStore, feedData, slotLimit);
			feedData = result.feedData;
		}
	});

	async function onChange() {
		feedData = {
			records: [],
			pagination: {
				lastPostId: '',
				limit: slotLimit,
				records: 0
			}
		};
		if (isPersonalFeed) {
			feedType = 'personal';
			isPersonalFeed = true;
		} else {
			feedType = 'global';
			isPersonalFeed = false;
		}
		result = await fetchPosts(loginToken, toastStore, feedData, slotLimit, feedType);
		feedData = result.feedData;
	}

	async function onLoadMorePosts() {
		result = await fetchPosts(loginToken, toastStore, feedData, slotLimit, feedType);
		feedData = result.feedData;
	}
</script>

<main class="">
	<div class="float-right mr-12">
		{#if loginToken == ''}
			<Login />
		{/if}
	</div>
	<div class="p-2 flex flex-row justify-center items-start">
		{#if loginToken !== ''}
			<div class="py-3">
				<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
					<RadioItem bind:group={isPersonalFeed} name="justify" value={false} on:change={onChange}
						>{$t('feed.personalFeed')}</RadioItem
					>
					<RadioItem bind:group={isPersonalFeed} name="justify" value={true} on:change={onChange}
						>{$t('feed.globalFeed')}</RadioItem
					>
				</RadioGroup>
			</div>
		{/if}
	</div>
	<div class="p-2 flex flex-col justify-center items-center">
		<Feed {feedData} />
		<div class="pt-2 pb-8">
			{#if feedData.records.length < feedData.pagination.records}
				<button on:click={onLoadMorePosts} class="btn variant-filled w-full md:w-auto py-2 px-4"
					>{$t('profile.loadMore')} ({feedData.records.length}/{feedData.pagination
						.records})</button
				>
			{/if}
		</div>
	</div>
</main>
