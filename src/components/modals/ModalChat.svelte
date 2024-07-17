<!-- Chat model in NavBar -->
<script lang="ts">
	import { Avatar, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import Icon from '@iconify/svelte';
	import type { ChatMessage, ChatMessages, ChatStructure } from '$lib/types/Chat';
	import { chatIdNewChat, chats, globalUsername, serverURL, token } from '$lib/Store';
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
		//all existing chats are loaded when the modal is opened
		dataChats = await getChats();
		chats.set(dataChats);
		copieChats = Object.assign({}, dataChats);
		//Last open chat is displayed
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
		//Existing WebSocket is closed
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
		//new websocket is created, call via the host url and with the respective chatId
		socket = new WebSocket(hostURL + '/chat?chatId=' + chatId, get(token));
		//An event listener is created to directly display new incoming messages
		socket.addEventListener('message', (event: MessageEvent) => {
			const response = JSON.parse(event.data);
			messages = [...messages, response];
			// sort messages by date
			messages = messages.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
		});
		socket.addEventListener('error', (event: Event) => {
			console.error('Websocket error:', event);
		});

		messageDisabeled = false;
		dataMessages = await getMessages(chatId, 10, 0);
		// sort messages by date
		dataMessages.records.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
		messages = dataMessages.records;
		const button = document.getElementById(chatId);
		//highlight current chat in list
		if (highlightedButton != '') {
			const oldButton = document.getElementById(highlightedButton);
			oldButton?.classList.remove('variant-filled-secondary');
		}
		highlightedButton = chatId;
		button?.classList.add('variant-filled-secondary');
	}

	function sendMessage() {
		//message is sent when the websocket is ready to receive and there is a message available
		if (socket && socket.readyState === WebSocket.OPEN && currentMessage) {
			socket.send(JSON.stringify({ content: currentMessage }));
			currentMessage = '';
			const textArea = document.getElementById('prompt') as HTMLTextAreaElement;
			textArea.focus;
		} else {
			console.error('failed');
		}
	}

	async function loadMoreMessages() {
		dataMessages = await getMessages($chatIdNewChat, 10, messages.length);
		dataMessages.records.sort((a, b) => b.creationDate.localeCompare(a.creationDate));
		messages = [...messages, ...dataMessages.records];
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

<div class="card w-[60vw] h-[75vh] p-2">
	<header class="h-[7%] flex flex-row justify-between items-center mb-2">
		<button class="btn-sm variant-filled-primary rounded" on:click={openModalBeginChat}>
			{$t('chat.button.add')}
		</button>
		<button type="button" class="variant-filled-secondary btn-sm rounded" on:click={closeModal}>
			{$t('chat.button.close')}
		</button>
	</header>
	<div class="flex flex-row h-[93%]">
		<!-- left column -->
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
			<div class="p-4 h-5/6 overflow-auto">
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
				</ul>
			</div>
		</div>
		<!-- right column -->
		<div class=" flex flex-col w-3/4 h-full justify-between">
			{#if highlightedButton != ''}
				<section
					class="w-full h-full flex flex-col-reverse p-2 overflow-y-scroll border-t border-surface-500/30"
				>
					{#each messages as message}
						{#if message.username === $globalUsername}
							<div class="flex float-end justify-end mt-2">
								<div
									class="card w-3/4 float-end p-4 variant-soft-primary rounded-tr-none space-y-2"
								>
									<header class="flex justify-between items-center">
										<p class="font-bold">{message.username}</p>
										<small class="text-gray-400">{convertDateTime(message.creationDate)}</small>
									</header>
									<p class="text-wrap max-w-full break-words">{message.content}</p>
								</div>
							</div>
						{:else}
							<div class="flex flex-col gap-1 mt-2">
								<div class="card w-3/4 float-start p-4 rounded-tl-none space-y-2 variant-soft">
									<header class="flex justify-between items-center">
										<p class="font-bold">{message.username}</p>
										<small class="text-gray-400">{convertDateTime(message.creationDate)}</small>
									</header>
									<p class="text-wrap max-w-full break-words">{message.content}</p>
								</div>
							</div>
						{/if}
					{/each}
					{#if messages.length < dataMessages.pagination.records}
						<button
							class="btn variant-filled w-full md:w-auto py-2 px-4"
							on:click={loadMoreMessages}
							>{$t('chat.pagination.loadMore')} ({messages.length ?? dataMessages.records.length} / {dataMessages
								.pagination.records})</button
						>
					{/if}
				</section>
			{:else}
				<section
					class="w-full h-full flex justify-center items-center border-t border-surface-500/30"
				>
					<p>{$t('chat.message.selectChat')}</p>
				</section>
			{/if}
			<div class="border-t border-surface-500/30 p-4" hidden={messageDisabeled}>
				<form class="input-group p-0 input-group-divider flex-row flex rounded-container-token">
					<textarea
						on:keypress={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								sendMessage();
							}
						}}
						bind:value={currentMessage}
						class="bg-transparent border-0 w-full"
						name="prompt"
						id="prompt"
						placeholder={$t('chat.placeholder.input')}
						rows="1"
						maxlength="256"
						disabled={messageDisabeled}
					/>
					<button
						class="variant-filled-primary w-14"
						disabled={currentMessage == '' ? true : false}
						on:click={sendMessage}
					>
						<Icon
							class="justify-center w-full h-full"
							inline
							style="color: white"
							icon={currentMessage == ''
								? 'material-symbols-light:cancel-schedule-send'
								: 'material-symbols-light:send'}
						/>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
