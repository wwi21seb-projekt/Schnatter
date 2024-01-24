<script lang="ts">
	import { page } from '$app/stores';
	import { globalUsername, token } from '$lib/Store';
	import type { Subscriptions } from '$lib/types/Subscriptions';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { unfollowUser } from '../../routes/profile/requests';
	import { createToast } from '$lib/Toasts';
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

		if (response == 204) {
			window.location.reload();
		} else {
			toastStore.trigger(createToast('Something went wrong, please try again later', 'error'));
		}
	}
</script>

<nav class="list-nav w-full">
	<!-- (optionally you can provide a label here) -->
	<ul class="w-full">
		{#each subscriptionData.records as subscriber}
			<li class="flex flex-row w-full justify-between">
				<a href="/profile?username={subscriber.user.username}" class="w-5/6">
					<Avatar src="../default-avatar.png" />

					<span class="flex-auto">
						<dt>{subscriber.user.username}</dt>
						<dd class="opacity-50">@{subscriber.user.nickname}</dd>
					</span>
				</a>
				{#if username == get(globalUsername)}
					<div class="flex flex-row justify-start items-center w-1/6">
						{#if pageRoute == '/profile/following'}
							<button
								class="btn variant-filled-error h-2/3"
								on:click={deleteSubscription}
								id={subscriber.subscriptionId}>Unfollow</button
							>
							<!-- {:else if pageRoute == '/profile/follower'}
							{#if subscriber.subscriptionId}
								<button>Unfollow</button>
							{:else}
								<button>Follow</button>
							{/if} -->
						{/if}
					</div>
				{/if}
			</li>
		{/each}

		<!-- ... -->
	</ul>
</nav>
