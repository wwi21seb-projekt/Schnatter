<script lang="ts">
	import { Avatar, getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import type { User, UsersforSearch } from '$lib/types/User';
	import { userSearch } from '$lib/utils/SearchUser';
	import UserSearchList from '../userLists/UserSearchList.svelte';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();
	let inputField: HTMLInputElement;
	let userInput: string;
	let users: Array<User> = [];
	const toastStore = getToastStore();

	const modalChat: ModalSettings = {
		type: 'component',
		component: 'modalChat'
	};

	onMount(async () => {
		inputField.focus();
	});
	async function handleUserChatSearch(event: Event) {
		userInput = (event.target as HTMLInputElement).value;
		if (userInput.length > 0) {
			const usersRequest: UsersforSearch | undefined = await userSearch(userInput, toastStore);
			if (usersRequest) {
				users = usersRequest.records;
			}
		}
		console.log(users);
	}
	function closeModal() {
		modalStore.close();
		modalStore.trigger(modalChat);
	}
</script>

<div class="card w-[40vw] h-[40vh] p-2">
	<header class="h-[13%] flex flex-row justify-between">
		<div class="">
			<input
				class="input w-full"
				title={$t('chat.tooltip.search')}
				type="search"
				placeholder={$t('chat.placeholder.search')}
				on:input={handleUserChatSearch}
				bind:this={inputField}
			/>
		</div>
		<div>
			<button
				type="button"
				class="btn variant-filled-secondary mx-1 justify-end"
				on:click={closeModal}
			>
				{$t('chat.newChat.cancel')}
			</button>
		</div>
	</header>
	<div class="flex flex-row">
		<div class="p-4 h-4/6 w-2/6 overflow-auto">
			{#if users != null && users.length > 0}
				<ul class="list">
					{#each users as user}
						<li>
							<button
								class="flex items-center rounded hover:variant-filled-primary p-1 w-full h-full"
							>
								<Avatar class="h-[3vh] w-[3vh] rounded-full mr-2" src="/default-avatar.png" />
								<span>{user.username}</span>
							</button>
						</li>
					{/each}
				</ul>
                {:else}
                <span>Es wurden keine User gefunden</span>
			{/if}
		</div>
		<div class="w-4/6">
			<span>Noch kein Chat gestartet</span>
		</div>
	</div>
</div>
