<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { serverURL, token } from '$lib/Store';
	import type { Profil } from '$lib/types/User';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { t } from '../../../i18n';

	initializeStores();
	const toastStore = getToastStore();

	let response: Response;
	let usernameInput: string;
	let serverUrl: string;
	let statusCode: number = 0;
	let users: Array<Profil> = [];
	let friendsInSearch: Array<Profil> = [];
	let isUserFriend: (user: Profil) => boolean = () => false;
	let blockedInSearch: Array<Profil> = [];
	let isUserBlocked: (user: Profil) => boolean = () => false;

	onMount(async () => {
		if (get(token) == '') {
			goto('/');
		}
	});

	$: {
		const friendsSet = new Set(friendsInSearch);
		isUserFriend = (user: Profil) => friendsSet.has(user);
		const blockedSet = new Set(blockedInSearch);
		isUserBlocked = (user: Profil) => blockedSet.has(user);
	}

	async function handleUsernameInput(event: Event) {
		usernameInput = (event.target as HTMLInputElement).value;
		if (usernameInput.length > 0) {
			serverURL.subscribe((prev_val) => (serverUrl = prev_val));
			const url: string = serverUrl + '/users?username=' + usernameInput + '&offset=0&limit=10';

			try {
				response = await fetch(url, {
					mode: 'cors',
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + get(token)
					}
				});
				statusCode = response.status;
			} catch (error) {
				toastStore.clear();
				toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
			}
			if (statusCode == 200) {
				const result = await response.json();
				users = result.records;
			} else {
				users = [];
				toastStore.clear();
				toastStore.trigger(createToast('Something went wrong!', 'error'));
			}
		} else {
			users = [];
		}
	}

	//get Friends

	function handleAddUserClick(user: Profil) {
		if (friendsInSearch.includes(user)) {
			friendsInSearch = friendsInSearch.filter((u) => u !== user);
		} else {
			friendsInSearch = [...friendsInSearch, user];
		}
	}

	//get Blocked

	function handleBlockUserClick(user: Profil) {
		if (blockedInSearch.includes(user)) {
			blockedInSearch = blockedInSearch.filter((u) => u !== user);
		} else {
			blockedInSearch = [...blockedInSearch, user];
		}
	}
</script>

<Toast />
<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
	<div class="mb-8 flex justify-center items-center gap-4">
		<a href="/search/users">
			<Icon
				class="w-10 h-10"
				title="searchUsersIcon"
				icon="mdi:account-search"
				style="font-size: 32px; border: 2px solid; border-radius: 5px;"
			/>
		</a>
		<a href="/search/posts">
			<Icon class="w-10 h-10" title="searchPostsIcon" icon="mdi:text-box-search-outline" style="font-size: 32px" />
		</a>
	</div>
	<input
		class="input w-full"
		title="searchUsersInput"
		type="search"
		name="username"
		on:input={handleUsernameInput}
		placeholder={$t('search.users.placeholder')}
	/>
	<div class="mt-4 w-full">
		{#if users != null && users.length > 0}
			{#each users as user}
				<div class="flex flex-row items-center justify-between w-full" title="userResult">
					<div class="flex flex-row items-center">
						<Avatar
							src={user.profilePictureUrl !== '' ? user.profilePictureUrl : '/default-avatar.png'}
							width="w-12"
							rounded="rounded-full"
						/>
						<div class="ml-4">
							<a href="/profile?username={user.username}" class="text-lg font-semibold">
								{#if user.nickname}
									{user.nickname}
								{:else}
									{user.username}
								{/if}
							</a>
							<p class="text-gray-500">@{user.username}</p>
						</div>
					</div>
					<div class="flex flex-row items-center">
						<button class="btn btn-primary" on:click={() => handleAddUserClick(user)}>
							<Icon
								class="w-10 h-10"
								icon={isUserFriend(user) ? 'mdi:account-check' : 'mdi:account-plus'}
								style="font-size: 32px"
							/>
						</button>
						<button class="btn btn-primary" on:click={() => handleBlockUserClick(user)}>
							<Icon
								class="w-10 h-10"
								icon="mdi:account-cancel"
								color={isUserBlocked(user) ? 'red' : 'white'}
								style="font-size: 32px"
							/>
						</button>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-center text-gray-500" title="noResultText">{$t('search.users.noResults')}</p>
		{/if}
	</div>
</div>
