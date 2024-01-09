<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { serverURL } from '$lib/Store';

	initializeStores();
	const toastStore = getToastStore();

	let response: Response;
	let usernameInput: string;
	let serverUrl: string;
	let statusCode: number = 0;
	let beispieluser = { username: 'beispiel', nickname: 'Beispieluser', avatar: '' };
	let users: Array<typeof beispieluser> = [];
	let friendsInSearch: Array<typeof beispieluser> = [];
	let isUserFriend: (user: typeof beispieluser) => boolean = () => false;
	let blockedInSearch: Array<typeof beispieluser> = [];
	let isUserBlocked: (user: typeof beispieluser) => boolean = () => false;

	$: {
		const friendsSet = new Set(friendsInSearch);
		isUserFriend = (user: typeof beispieluser) => friendsSet.has(user);
		const blockedSet = new Set(blockedInSearch);
		isUserBlocked = (user: typeof beispieluser) => blockedSet.has(user);
	}

	async function handleUsernameInput(event: Event) {
		usernameInput = (event.target as HTMLInputElement).value;
		if (usernameInput.length > 0) {
			serverURL.subscribe((prev_val) => (serverUrl = prev_val));
			const url: string = serverUrl + '/users?' + usernameInput + '&0&10';
			try {
				response = await fetch(url, {
					mode: 'cors',
					method: 'GET'
				});
				statusCode = response.status;
			} catch (error) {
				toastStore.clear();
				console.log(error);
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

	function handleAddUserClick(user: typeof beispieluser) {
		if (friendsInSearch.includes(user)) {
			friendsInSearch = friendsInSearch.filter((u) => u !== user);
		} else {
			friendsInSearch = [...friendsInSearch, user];
		}
	}

	//get Blocked

	function handleBlockUserClick(user: typeof beispieluser) {
		if (blockedInSearch.includes(user)) {
			blockedInSearch = blockedInSearch.filter((u) => u !== user);
		} else {
			blockedInSearch = [...blockedInSearch, user];
		}
	}
</script>

<Toast />
<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
	<input
		class="input w-full"
		type="search"
		name="username"
		on:input={handleUsernameInput}
		placeholder="Search a user..."
	/>
	<div class="mt-4 w-full">
		{#each users as user}
			<div class="flex flex-row items-center justify-between w-full">
				<div class="flex flex-row items-center">
					<img class="w-12 h-12 rounded-full" src={user.avatar} alt="Avatar" />
					<div class="ml-4">
						<a href="/users/{user.username}" class="text-lg font-semibold">{user.nickname}</a>
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
	</div>
</div>
