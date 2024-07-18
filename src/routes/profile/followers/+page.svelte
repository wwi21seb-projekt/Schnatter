<script lang="ts">
	import { onMount } from 'svelte';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { getSubscriptions } from '$lib/utils/Subscription';
	import { get } from 'svelte/store';
	import { globalUsername, token } from '$lib/Store';
	import { t } from '../../../i18n';
	import SubscriptionList from '../../../components/userLists/SubscriptionList.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { manageSession } from '$lib/utils/Session';

	const toastStore = getToastStore();
	let usernameParams: string = '';
	let username: string = '';
	let followerData: Subscriptions = {
		records: [],
		pagination: {
			offset: 0,
			limit: 0,
			records: 0
		}
	};

	onMount(async () => {
		manageSession(toastStore);
		const url = window.location.search;
		usernameParams = url.split('=')[1];

		if (usernameParams == undefined) {
			username = get(globalUsername);
		} else {
			username = usernameParams;
		}
		const response = await getSubscriptions(get(token), 'followers', 0, 10, username, toastStore);
		if (response.status == 200 && response.data) {
			followerData = await response.data;
		}
	});
</script>

<main class="flex flex-col items-center min-h-[70vh] mt-[90px]">
	<h2 class="h2 mb-10">{$t('profile.followers')}</h2>
	<div class="mb-20">
		{#if followerData.records.length == 0}
			<p class="text-center">{$t('followers.user.emptyList')}</p>
		{:else}
			<div class="md:w-[40vw] w-[85vw]">
				<SubscriptionList subscriptionData={followerData} />
			</div>
		{/if}
	</div>
</main>
