<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/Login.svelte';
	import Feed from '../components/Feed.svelte';
	import { token } from '$lib/Store';
	import { onMount } from 'svelte';
	import { RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { Feed as FeedStructure } from '$lib/types/Feed';
	import { fetchPosts } from './FeedPosts';
	import { t } from '../i18n';

	let hasMorePosts = true;
	let maxPostCounter = 0;
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
	let value: boolean = false; // FeedType: true = personal, false = global

	const toastStore = getToastStore();
	const loginToken = get(token);
	onMount(async () => {
		if (loginToken !== '') {
			fetchPosts(
				loginToken,
				toastStore,
				hasMorePosts,
				maxPostCounter,
				feedData,
				slotLimit,
				feedType
			);
		} else {
			fetchPosts(loginToken, toastStore, hasMorePosts, maxPostCounter, feedData, slotLimit);
		}
	});

	function onChange() {
		hasMorePosts = true;
		fetchPosts(loginToken, toastStore, hasMorePosts, maxPostCounter, feedData, slotLimit, feedType);
		if (value) {
			feedType = 'personal';
		} else {
			feedType = 'global';
		}
	}
</script>

<main class="">
	<div class="float-right mr-12">
		{#if loginToken == ''}
			<Login />
		{/if}
	</div>
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
	<div class="p-2 flex flex-row justify-center items-start">
		<Feed {feedData} />
	</div>
</main>
