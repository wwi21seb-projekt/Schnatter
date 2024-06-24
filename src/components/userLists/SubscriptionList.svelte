<script lang="ts">
	import { page } from '$app/stores';
	import { globalUsername, token } from '$lib/Store';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { followUser, unfollowUser } from '../../lib/utils/Profile';
	import { createToast } from '$lib/utils/Toasts';
	import { t } from '../../i18n';
	import ProfilePicture from '../ProfilePicture.svelte';
	import { getSubscriptions } from '$lib/utils/Subscription';
	export let subscriptionData: Subscriptions;
	let username: string = '';
	let pageRoute: string | null = '';
	const toastStore = getToastStore();

	onMount(async () => {
		const url = window.location.search;
		username = url.split('=')[1];
		pageRoute = $page.route.id;
	});

	async function deleteSubscription(event: Event) {
		const subId = (event?.target as HTMLButtonElement)?.id;
		const response = await unfollowUser(get(token), subId);

		if (response.status == 204) {
			window.location.reload();
		} else {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		}
	}
	async function handlePagination() {
		const path = window.location.pathname;
		const listtype = path.split('/')[2];

		let records = subscriptionData.records;
		const response = await getSubscriptions(
			get(token),
			listtype,
			subscriptionData.records.length,
			10,
			username
		);
		if (response.status == 200 && response.data) {
			subscriptionData = (await response.data) as Subscriptions;
			subscriptionData.records = [...records, ...subscriptionData.records];
		} else if (response.status == 500) {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		} else if (response.customError) {
			toastStore.trigger(createToast(response.customError.message, 'error'));
		}
	}

	async function handlefollow(event: Event) {
		const followUsername = (event?.target as HTMLButtonElement)?.id;
		const response = await followUser(get(token), followUsername);
		if (response.status == 201) {
			window.location.reload();
		} else if (response.status == 500) {
			toastStore.trigger(createToast($t('toast.internalError'), 'error'));
		} else {
			toastStore.clear();
			toastStore.trigger(createToast(response.customError?.message ?? '', 'error'));
		}
	}
</script>

<Toast zIndex="1100" />
<div class="flex justify-center flex-col items-center">
	<nav class="list-nav w-full">
		<ul class="w-full">
			{#each subscriptionData.records as subscriber}
				<li class="flex flex-row w-full justify-between">
					<a href="/profile?username={subscriber.username}" class="md:w-5/6">
						<ProfilePicture
							src={subscriber.picture?.url ?? ''}
							username={subscriber.username}
							cssClass=""
						/>
						<span class="flex-auto">
							<dt>{subscriber.username}</dt>
							<dd class="opacity-50">@{subscriber.nickname}</dd>
						</span>
					</a>
					{#if username == get(globalUsername)}
						<div class="flex flex-row justify-start items-center md:w-1/6 ml-2">
							{#if pageRoute == '/profile/following'}
								<button
									class="btn variant-filled-error h-2/3"
									on:click={deleteSubscription}
									id={subscriber.followingId}>{$t('profile.unfollow')}</button
								>
							{:else if pageRoute == '/profile/followers'}
								{#if !subscriber.followingId}
									<button
										id={subscriber.username}
										on:click={handlefollow}
										class="btn variant-filled-primary">{$t('profile.follow')}</button
									>
								{/if}
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
	{#if subscriptionData.records.length !== subscriptionData.pagination.records}
		<div class="w-full flex justify-center">
			<button on:click={handlePagination} type="button" class="btn variant-filled">Load more</button
			>
		</div>
	{/if}
</div>
