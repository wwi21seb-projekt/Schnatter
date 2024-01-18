<script lang="ts">
	import Post from './Post.svelte';
	import { onMount } from 'svelte';
	import {
		Toast,
		getToastStore,
		initializeStores,
		RadioGroup,
		RadioItem
	} from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { token, serverURL } from '$lib/Store';
	import { get } from 'svelte/store';
	import type { FetchFeedResponse } from '$lib/types/Feed.ts';
	import { t } from '../i18n';

	const loginToken = get(token);
	initializeStores();
	const toastStore = getToastStore();

	let statusCode: number = 0;
	let posts: Array<Post> = [];
	let value: number = 0;
	let maxPostCounter: number = 0;
	let feedData: FetchFeedResponse;
	let feedType: string;
	const serverUrl = get(serverURL);
	const slotLimit = 10;
	let hasMorePosts: boolean = true;
	let paramsChangeable = new URLSearchParams([
		['postId', ''],
		['limit', slotLimit.toString()],
		['feedType', 'global']
	]);
	let paramsGlobalOnly = new URLSearchParams([
		['postId', ''],
		['limit', slotLimit.toString()]
	]);

	async function loadMorePosts() {
		if (loginToken !== '' && value === 0) {
			paramsChangeable.set('postId', feedData.pagination.lastPostId.toString());
			paramsChangeable.set('feedType', feedType);
		} else if (loginToken !== '' && value === 1) {
			paramsChangeable.set('postId', feedData.pagination.lastPostId.toString());
		} else {
			paramsGlobalOnly.set('postId', feedData.pagination.lastPostId.toString());
		}

		let params = loginToken === '' ? paramsGlobalOnly : paramsChangeable;
		const url: string = serverUrl + '/feed?' + params;
		try {
			let response = await fetch(url, {
				mode: 'cors',
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + get(token)
				}
			});
			statusCode = response.status;
			if (statusCode === 200) {
				const result = await response.json();
				if (result.records.length === 0) {
					hasMorePosts = false;
				} else {
					maxPostCounter += result.records.length;
					posts = posts.concat(result.records);
					feedData.records = feedData.records.concat(result.records);
				}
			}
		} catch (error) {
			toastStore.clear();
			toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
		}
	}

	function setFeedType() {
		if (loginToken !== '' && value === 1) {
			paramsChangeable.set('feedType', 'personal');
			feedType = 'personal';
		} else {
			paramsChangeable.set('feedType', 'global');
			feedType = 'global';
		}
	}

	async function onChange() {
		setFeedType();
		fetchMatchingFeed(false);
	}

	async function fetchMatchingFeed(isGlobal: boolean) {
		let params = isGlobal ? paramsGlobalOnly : paramsChangeable;
		const url: string = serverUrl + '/feed?' + params;
		try {
			let response = await fetch(url, {
				mode: 'cors',
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + get(token)
				}
			});
			statusCode = response.status;

			if (statusCode === 200) {
				const result = await response.json();
				posts = result.records;
				maxPostCounter += posts.length;
				feedData = result;
			} else if (statusCode !== 200 && statusCode !== 500) {
				//Fehler-Handling von 400 Bad Request
				// error objekt auslesen, wie result s.o. customError.message
				// copy from register/verify
				posts = [];
				toastStore.clear();
				toastStore.trigger(createToast($t('toast.somethingWrong'), 'error'));
			}
		} catch (error) {
			toastStore.clear();
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		}
	}

	onMount(async () => {
		if (loginToken !== '') {
			fetchMatchingFeed(true);
		} else {
			fetchMatchingFeed(false);
		}
	});
</script>

<main class="flex flex-wrap justify-around">
	{#if loginToken !== ''}
		<div class="py-4">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={value} name="justify" value={0} on:change={onChange}
					>{$t('feed.personalFeed')}</RadioItem
				>
				<RadioItem bind:group={value} name="justify" value={1} on:change={onChange}
					>{$t('feed.globalFeed')}</RadioItem
				>
			</RadioGroup>
		</div>
	{/if}
	{#each posts as postData (postData.postId)}
		<Post {postData} />
	{/each}
	{#if maxPostCounter % slotLimit == 0 && hasMorePosts}
		<button on:click={loadMorePosts} class="btn variant-filled">{$t('profile.loadMore')}</button>
	{/if}
	<Toast />
</main>
