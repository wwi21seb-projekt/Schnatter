<script lang="ts">
	import { Avatar, getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import type { User, UsersForSearch } from '$lib/types/User';
	import { userSearch } from '$lib/utils/SearchUser';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { createChat } from '$lib/utils/Chat';

	const modalStore = getModalStore();
	let inputField: HTMLInputElement;
	let userInput: string;
	let users: Array<User> = [];
	const toastStore = getToastStore();

	const modalChat: ModalSettings = {
		type: 'component',
		component: 'modalChat'
	};

	let sendDisabled = true;
	let initialMessage: string = '';
	let userNewChat: string;

	onMount(async () => {
		inputField.focus();
	});
	async function handleUserChatSearch(event: Event) {
		userInput = (event.target as HTMLInputElement).value;
		if (userInput.length > 0) {
			const usersRequest: UsersForSearch | undefined = await userSearch(userInput, toastStore);
			if (usersRequest) {
				users = usersRequest.records;
			}
		}
	}
	function openInitialChat(userName: string) {
		sendDisabled = false;
		userNewChat = userName;
	}
	function closeModal() {
		modalStore.close();
		modalStore.trigger(modalChat);
	}
	async function startChat() {
		await createChat(userNewChat, initialMessage);
		modalStore.close();
		modalStore.trigger(modalChat);
	}
</script>

<div class="card w-[60vw] h-[50vh] p-2">
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
	<div class="flex flex-row h-[87%]">
		<div class="p-4 h-full w-2/6 overflow-y-scroll">
			{#if users != null && users.length > 0}
				<ul class="list h-full">
					{#each users as user}
						<li>
							<button
								class="flex items-center rounded hover:variant-filled-primary p-1 w-full"
								on:click={() => openInitialChat(user.username)}
							>
								<Avatar class="h-[3vh] w-[3vh] rounded-full mr-2" src="/default-avatar.png" />
								<span>{user.username}</span>
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<span>{$t('chat.newChat.noUsers')}</span>
			{/if}
		</div>
		<div class="w-4/6">
			<span class="p-5" hidden={!sendDisabled}>{$t('chat.newChat.noChat')}</span>
			<div class="border-t border-surface-500/30 p-4" hidden={sendDisabled}>
				<div class="header mb-5">
					<span>{$t('chat.newChat.headerChat')} {userNewChat}</span>
				</div>
				<form
					class="input-group input-group-divider flex-row flex rounded-container-token"
					on:submit={startChat}
				>
					<textarea
						on:keypress={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								startChat();
							}
						}}
						bind:value={initialMessage}
						class="bg-transparent border-0 w-11/12"
						name="prompt"
						id="prompt"
						placeholder={$t('chat.placeholder.input')}
						rows="1"
						maxlength="256"
						disabled={sendDisabled}
					/>
					<button
						class="variant-filled-primary w-1/12"
						disabled={sendDisabled}
						on:click={startChat}
					>
						<Icon
							class="w-7 h-7 align-middle justify-center"
							inline
							style="color: antiquewhite"
							icon="fluent:send-16-filled"
						/>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
