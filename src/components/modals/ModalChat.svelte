<!-- Chat model in NavBar -->
<script lang="ts">
	import { Avatar, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import Icon from '@iconify/svelte';
	import type { ChatMessage, ChatMessages, ChatStructure } from '$lib/types/Chat';
	import { chatIdNewChat, globalUsername, serverURL, token } from '$lib/Store';
	import { get } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { getChats, getMessages } from '$lib/utils/Chat';
	import type { UUID } from 'crypto';
	import { convertDateTime } from '$lib/utils/Time';

	const modalStore = getModalStore();
	let userSearch: string = '';

	const modalBeginChat: ModalSettings = {
		type: 'component',
		component: 'modalBeginChat'
	};

	let highlightedButton = '';
	let currentMessage: string = '';
	let dataMessages: ChatMessages = {
		records: [],
		pagination: {
			records: 1,
			limit: 10,
			offset: 0
		}
	};
	let messageDisabeled = true;
	let socket: WebSocket | null = null;
	let messages: ChatMessage[] = [];

	let dataChats: ChatStructure = {
		records: [
			{
				chatId: '47c2a53c-c761-4e4c-99e0-75c084160ff4',
				user: {
					username: '',
					nickname: '',
					picture: undefined
				}
			}
		]
	};

	let copieChats = Object.assign({}, dataChats);

	onMount(async () => {
		dataChats = await getChats();
		copieChats = Object.assign({}, dataChats);
		if ($chatIdNewChat) {
			openChat($chatIdNewChat);
		}
	});

	function handleChatSearch() {
		dataChats = Object.assign({}, copieChats);
		dataChats.records = dataChats.records.filter((record) =>
			record.user.username.toLowerCase().includes(userSearch.toLowerCase())
		);
	}

	async function openChat(chatId: UUID) {
		if (socket) {
			socket.close();
		}
		chatIdNewChat.set(chatId);
		const pathArray = get(serverURL).split(':');
		// for mockserver
		if (pathArray[0] === 'http') {
			pathArray[0] = 'ws';
		} else {
			pathArray[0] = 'wss';
		}
		const hostURL = pathArray[0] + ':' + pathArray[1];
		socket = new WebSocket(hostURL + '/chat?chatId=' + chatId, get(token));
		socket.addEventListener('message', (event: MessageEvent) => {
			const respone = JSON.parse(event.data);
			messages = [...messages, respone];
			// sort messages by date
			messages = messages.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
		});
		socket.addEventListener('error', (event: Event) => {
			console.error('Websocket error:', event);
		});

		messageDisabeled = false;
		dataMessages = await getMessages(chatId, 10, 0);
		dataMessages.records.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
		messages = dataMessages.records;
		const button = document.getElementById(chatId);
		if (highlightedButton != '') {
			const oldButton = document.getElementById(highlightedButton);
			oldButton?.classList.remove('variant-filled-secondary');
		}
		highlightedButton = chatId;
		button?.classList.add('variant-filled-secondary');
	}

	function sendMessage() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ content: currentMessage }));
			currentMessage = '';
		} else {
			console.error('failed');
		}
	}

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});

	function openModalBeginChat() {
		modalStore.close();
		modalStore.trigger(modalBeginChat);
	}

	function closeModal() {
		modalStore.close();
	}
</script>

<div class="card md:w-[60vw] w-screen h-[80vh] p-2">
	<header class="h-[7%] flex flex-row justify-between">
		<div class="flex items-center justify-start p-4 h-1/6 align-baseline">
			<button class="btn-sm variant-filled-primary rounded" on:click={openModalBeginChat}>
				{$t('chat.button.add')}
			</button>
		</div>
		<div>
			<button
				type="button"
				class="btn variant-filled-secondary mx-1 justify-end"
				on:click={closeModal}
			>
				{$t('chat.button.close')}
			</button>
		</div>
	</header>
	<div class="flex flex-row h-[93%]">
		<!-- linke Spalte -->
		<div class="h-full flex flex-col border-r border-surface-500/30">
			<div class=" p-4 h-1/6 border-y border-surface-500/30">
				<input
					class="input w-full"
					title={$t('chat.tooltip.search')}
					type="search"
					placeholder={$t('chat.placeholder.search')}
					bind:value={userSearch}
					on:input={handleChatSearch}
				/>
			</div>
			<div class="p-4 h-4/6">
				<ul class="list">
					{#each dataChats.records as record (record.chatId)}
						<li class="h-9">
							<button
								id={record.chatId}
								on:click={() => openChat(record.chatId)}
								class="flex items-center rounded hover:variant-filled-primary p-1 w-full h-full"
								><Avatar
									class="w-8 h-8s"
									src={record.user.picture?.url}
									initials={record.user.username.substring(0, 2)}
								/>
								<span class="m-2">{record.user.username}</span></button
							>
						</li>
					{/each}

					<!-- ... -->
				</ul>
			</div>
		</div>
		<!-- rechte Spalte -->
		<div class=" flex flex-col w-3/4 h-full justify-between">
			{#if highlightedButton != ''}
				<section
					class="w-full h-full flex flex-col-reverse p-2 overflow-y-scroll border-t border-surface-500/30"
				>
					{#each messages as message}
						<!-- {#if message.username === get(globalUsername)} -->
						{#if message.username === $globalUsername}
							<div class="flex float-end justify-end mt-2">
								<div
									class="card w-3/4 float-end p-4 variant-soft-primary rounded-tr-none space-y-2"
								>
									<header class="flex justify-between items-center">
										<p class="font-bold">{message.username}</p>
										<small class="text-gray-400">{convertDateTime(message.creationDate)}</small>
									</header>
									<p>{message.content}</p>
								</div>
							</div>
						{:else}
							<div class="flex flex-col gap-1 mt-2">
								<div class="card w-3/4 float-start p-4 rounded-tl-none space-y-2 variant-soft">
									<header class="flex justify-between items-center">
										<p class="font-bold">{message.username}</p>
										<small class="text-gray-400">{convertDateTime(message.creationDate)}</small>
									</header>
									<p>{message.content}</p>
								</div>
							</div>
						{/if}
					{/each}
				</section>
			{:else}
				<section
					class="w-full h-full flex justify-center items-center border-t border-surface-500/30"
				>
					<p>{$t('chat.message.selectChat')}</p>
				</section>
			{/if}
			<div class="border-t border-surface-500/30 p-4" hidden={messageDisabeled}>
				<div class="input-group input-group-divider flex-row flex rounded-container-token">
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 w-11/12"
						name="prompt"
						id="prompt"
						placeholder={$t('chat.placeholder.input')}
						rows="1"
						maxlength="256"
						disabled={messageDisabeled}
					/>
					<button
						class="variant-filled-primary w-1/12"
						disabled={messageDisabeled}
						on:click={sendMessage}
					>
						<Icon
							class="w-7 h-7 align-middle justify-center"
							inline
							style="color: antiquewhite"
							icon="fluent:send-16-filled"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
