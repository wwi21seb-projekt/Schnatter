<script lang="ts">
	import { onMount } from 'svelte';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { getSubscriptions } from '$lib/utils/Subscription';
	import { get } from 'svelte/store';
	import { globalUsername, token } from '$lib/Store';
	import { t } from '../../../i18n';
	import SubscriptionList from '../../../components/userLists/SubscriptionList.svelte';
	let offsetList = 0;
	let limit = 10;
	let usernameParams: string = '';
	let username: string = '';
	let followingData: Subscriptions = {
		records: [],
		pagination: {
			offset: 0,
			limit: 0
		}
	};

	onMount(async () => {
		const url = window.location.search;
		usernameParams = url.split('=')[1];

		if (usernameParams == undefined) {
			username = get(globalUsername);
		} else {
			username = usernameParams;
		}
		followingData = await getSubscriptions(get(token), 'following', offsetList, limit, username);
		offsetList += limit;
	});
</script>

<main class="flex flex-col items-center mt-16 min-h-[75vh]">
	<h2 class="h2 mb-10">{$t('profile.following')}</h2>
	<div class="mb-20">
		{#if followingData.records.length == 0}
			<p class="text-center">{$t('followers.user.emptyList')}</p>
		{:else}
			<div class="w-[40vw]">
				<SubscriptionList subscriptionData={followingData} />
			</div>
		{/if}
	</div>
</main>
