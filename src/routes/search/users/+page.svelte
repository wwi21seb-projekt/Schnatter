<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { createToast } from '$lib/Toasts';
	import Icon from '@iconify/svelte';
	import { serverURL, token } from '$lib/Store';
	import type { User } from '$lib/types/User';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { t } from '../../../i18n';
	import UserSearchList from '../../../components/userLists/UserSearchList.svelte';
	import { manageSession } from '$lib/utils/Session';

	const toastStore = getToastStore();
	let focusfield: HTMLInputElement;
	let response: Response;
	let usernameInput: string;
	let statusCode: number = 0;
	let users: Array<User> = [];

	onMount(async () => {
		manageSession();
		focusfield.focus();
	});

	async function handleUsernameInput(event: Event) {
		usernameInput = (event.target as HTMLInputElement).value;
		if (usernameInput.length > 0) {
			const serverUrl = get(serverURL);
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
				toastStore.trigger(createToast($t('toast.internalError'), 'error'));
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
</script>

<Toast />
<div class="mt-8 mb-8 w-3/5 min-h-screen mx-auto">
	<div class="mb-8 flex justify-center items-center gap-4">
		<a href="/search/users" data-sveltekit-preload-data="hover">
			<Icon
				class="w-10 h-10 text-primary-500"
				title="searchUsersIcon"
				icon="mdi:account-search"
				style="font-size: 32px; border: 2px solid; border-radius: 5px;"
			/>
		</a>
		<a href="/search/posts" data-sveltekit-preload-data="hover">
			<Icon
				class="w-10 h-10"
				title="searchPostsIcon"
				icon="mdi:text-box-search-outline"
				style="font-size: 32px"
			/>
		</a>
	</div>
	<input
		class="input w-full"
		title="searchUsersInput"
		type="search"
		name="username"
		on:input={handleUsernameInput}
		placeholder={$t('search.users.placeholder')}
		bind:this={focusfield}
	/>
	<div class="mt-4 w-full">
		{#if users != null && users.length > 0}
			<UserSearchList searchData={users} />
		{:else}
			<p class="text-center text-gray-500" title="noResultText">{$t('search.users.noResults')}</p>
		{/if}
	</div>
</div>
