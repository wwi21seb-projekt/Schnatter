<script lang="ts">
	import { onMount } from 'svelte';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { getSubscriptions } from '$lib/utils/Subscription';
	import { get } from 'svelte/store';
	import { globalUsername, token } from '$lib/Store';
	import { t } from '../../../i18n';
	import SubscriptionList from '../../../components/userLists/SubscriptionList.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { manageSession } from '$lib/utils/Session';

	const toastStore = getToastStore();
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
		manageSession();
		const url = window.location.search;
		usernameParams = url.split('=')[1];

		if (usernameParams == undefined) {
			username = get(globalUsername);
		} else {
			username = usernameParams;
		}
		const response = await getSubscriptions(get(token), 'following', offsetList, limit, username);

		if (response.status == 200 && response.data) {
			followingData = await response.data;
		} else if (response.status == 500) {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		} else if (response.customError) {
			toastStore.trigger(createToast(response.customError.message, 'error'));
		}
		offsetList += limit;
	});
</script>

<main class="flex flex-col items-center mt-16 min-h-[70vh]">
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
