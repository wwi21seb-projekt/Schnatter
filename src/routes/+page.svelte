<script lang="ts">
	import { get } from 'svelte/store';
	import Login from '../components/login/Login.svelte';
	import Feed from '../components/posts/Feed.svelte';
	import { serverURL, token } from '$lib/Store';
	import { onMount } from 'svelte';
	import { RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { Feed as FeedStructure } from '$lib/types/Feed';
	import { fetchPosts } from '../lib/utils/FeedPosts';
	import { t } from '../i18n';
	import { manageSession } from '$lib/utils/Session';
	//depending on whether you are logged in or not, there are different tailwind classes
	const loggedIn = 'flex justify-start md:justify-center flex-col mt-[90px]';
	const notLoggedIn = 'flex md:flex-row-reverse justify-start md:justify-center flex-col mt-[90px]';

	let slotLimit = 10;
	//general default setting is the display of global feed
	let feedType = 'global';
	let feedData: FeedStructure = {
		records: [],
		pagination: {
			lastPostId: '',
			limit: slotLimit,
			records: 0
		}
	};
	let isPersonalFeed: boolean = false;
	const toastStore = getToastStore();
	const loginToken = get(token);
	let result;

	onMount(async () => {
		//connected to Breta-Server by default
		//but can also be changed later by the user
		if (get(serverURL) === '') {
			serverURL.set('https://server-beta.de/api');
		}
		manageSession();
		//Check whether you are logged in, then feed depending on type
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

<main class={get(token) ? loggedIn : notLoggedIn}>
	<div class="mr-12">
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
