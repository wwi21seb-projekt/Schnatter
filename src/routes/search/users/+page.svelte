<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import type { User, UsersForSearch } from '$lib/types/User';
	import { onMount } from 'svelte';
	import { t } from '../../../i18n';
	import UserSearchList from '../../../components/userLists/UserSearchList.svelte';
	import { manageSession } from '$lib/utils/Session';
	import { userSearch } from '$lib/utils/SearchUser';

	let focusfield: HTMLInputElement;
	let usernameInput: string;
	let users: Array<User> = [];
	const toastStore = getToastStore();

	onMount(async () => {
		manageSession();
		focusfield.focus();
	});

	async function handleUsernameInput(event: Event) {
		usernameInput = (event.target as HTMLInputElement).value;
		if (usernameInput.length > 0) {
			const usersRequest: UsersForSearch | undefined = await userSearch(usernameInput, toastStore);
			if (usersRequest) {
				users = usersRequest.records;
			}
		}
	}
</script>

<Toast zIndex="1100" />
<div class="mb-8 w-3/5 min-h-screen mx-auto mt-[122px]">
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
