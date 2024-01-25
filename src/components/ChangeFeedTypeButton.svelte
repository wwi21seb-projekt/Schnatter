<script lang="ts">
	import { RadioGroup, RadioItem, getToastStore } from '@skeletonlabs/skeleton';
	import { token, serverURL } from '$lib/Store';
	import { get } from 'svelte/store';
	import { t } from '../i18n';
	import { setPostIdAndFeedType, fetchPosts } from '$lib/FeedFunctions';
	import { value, hasMorePosts, feedType } from '$lib/FeedDataStore';

	const toastStore = getToastStore();

	let localValue = $value;

	value.subscribe((v) => {
		localValue = v;
	});

	const loginToken = get(token);

	async function onChange() {
		const loginToken = get(token);
		const url = get(serverURL);
		value.set(localValue);
		setPostIdAndFeedType(loginToken, '', get(value));
		hasMorePosts.set(true);
		fetchPosts(false, url, toastStore);
	}
</script>

<main class="flex flex-col items-center">
	{#if loginToken !== ''}
		<div class="py-3">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={localValue} name="justify" value={false} on:change={onChange}
					>{$t('feed.personalFeed')}</RadioItem
				>
				<RadioItem bind:group={localValue} name="justify" value={true} on:change={onChange}
					>{$t('feed.globalFeed')}</RadioItem
				>
			</RadioGroup>
		</div>
	{/if}
</main>
