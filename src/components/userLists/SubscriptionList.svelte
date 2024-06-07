<script lang="ts">
	import { page } from '$app/stores';
	import { globalUsername, token } from '$lib/Store';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { Avatar, Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { followUser, unfollowUser } from '../../routes/profile/requests';
	import { createToast } from '$lib/Toasts';
	import { t } from '../../i18n';
	import { getInitalsFromUsername } from '$lib/utils/Pictures';
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
			toastStore.trigger(createToast('Something went wrong, please try again later', 'error'));
		}
	}

	async function handlefollow(event: Event) {
		const followUsername = (event?.target as HTMLButtonElement)?.id;
		const response = await followUser(get(token), followUsername);
		if (response.status == 201) {
			window.location.reload();
		} else if (response.status == 500) {
			toastStore.trigger(createToast('Internal Server Error', 'error'));
		} else {
			toastStore.clear();
			toastStore.trigger(createToast(response.customError?.message ?? '', 'error'));
		}
	}
</script>

<Toast />
<nav class="list-nav w-full">
	<ul class="w-full">
		{#each subscriptionData.records as subscriber}
			<li class="flex flex-row w-full justify-between">
				<a href="/profile?username={subscriber.username}" class="w-5/6">
					<Avatar
						src={subscriber.picture?.pictureURL}
						initials={getInitalsFromUsername(subscriber.username)}
					/>

					<span class="flex-auto">
						<dt>{subscriber.username}</dt>
						<dd class="opacity-50">@{subscriber.nickname}</dd>
					</span>
				</a>
				{#if username == get(globalUsername)}
					<div class="flex flex-row justify-start items-center w-1/6 ml-2">
						{#if pageRoute == '/profile/following'}
							<button
								class="btn variant-filled-error h-2/3"
								on:click={deleteSubscription}
								id={subscriber.followingId}>{$t('profile.unfollow')}</button
							>
						{:else if pageRoute == '/profile/follower'}
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
