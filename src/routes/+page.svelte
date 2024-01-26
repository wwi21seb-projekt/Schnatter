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

	let hasMorePosts = true;
	let maxPostCounter = 0;
	let slotLimit = 2;
	let feedType = 'global';
	let feedData: FeedStructure = {
		records: [],
		pagination: {
			lastPostId: '',
			limit: slotLimit,
			records: 0
		}
	};
	let value: boolean = false; // FeedType: true = personal, false = global

	const toastStore = getToastStore();
	const loginToken = get(token);

	onMount(async () => {
		let result;
		if (loginToken !== '') {
			result = await fetchPosts(
				loginToken,
				toastStore,
				hasMorePosts,
				maxPostCounter,
				feedData,
				slotLimit,
				feedType
			);
			feedData = result.feedData;
			maxPostCounter = result.maxPostCounter;
			hasMorePosts = result.hasMorePosts;
		} else {
			result = await fetchPosts(
				loginToken,
				toastStore,
				hasMorePosts,
				maxPostCounter,
				feedData,
				slotLimit
			);
			feedData = result.feedData;
			maxPostCounter = result.maxPostCounter;
			hasMorePosts = result.hasMorePosts;
		}
	});

	async function onChange() {
		feedData= {
			records: [],
			pagination: {
				lastPostId: '',
				limit: slotLimit,
				records: 0
			}
		};
		hasMorePosts = true;
		maxPostCounter = 0;
		if (value) {
			feedType = 'personal';
			value = true;
		} else {
			feedType = 'global';
			value = false;
		}
		let result = await fetchPosts(
			loginToken,
			toastStore,
			hasMorePosts,
			maxPostCounter,
			feedData,
			slotLimit,
			feedType
		);
		feedData = result.feedData;
			maxPostCounter = result.maxPostCounter;
			hasMorePosts = result.hasMorePosts;
	}

	async function onLoadMorePosts() {
		const result = await fetchPosts(
			loginToken,
			toastStore,
			hasMorePosts,
			maxPostCounter,
			feedData,
			slotLimit,
			feedType
		);
		(feedData = result.feedData), (maxPostCounter = result.maxPostCounter);
		hasMorePosts = result.hasMorePosts;
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
					<RadioItem bind:group={value} name="justify" value={false} on:change={onChange}
						>{$t('feed.personalFeed')}</RadioItem
					>
					<RadioItem bind:group={value} name="justify" value={true} on:change={onChange}
						>{$t('feed.globalFeed')}</RadioItem
					>
				</RadioGroup>
			</div>
		{/if}
	</div>
	<div class="p-2 flex flex-row justify-center items-start">
		<Feed {feedData} />
	</div>
	<div class="p-4 flex flex-row justify-center items-start">
		{#if maxPostCounter % slotLimit == 0 && hasMorePosts && feedData.records.length > 0}
			<button on:click={onLoadMorePosts} class="btn variant-filled w-full md:w-auto py-2 px-4"
				>{$t('profile.loadMore')}</button
			>
		{/if}
	</div>
</main>
