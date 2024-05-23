<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { t } from '../../i18n';
	import Icon from '@iconify/svelte';
	import type { ChatMessages, ChatStructure } from '$lib/types/Chat';
	import { globalUsername } from '$lib/Store';
	import { get } from 'svelte/store';
	console.log('modal chat');
	const modalStore = getModalStore();
	let currentMessage = '';

	const dataMessages: ChatMessages = {
		records: [
			{
				username: 'Nora',
				content: 'Hier steht der Inhalt der Nachricht',
				timestamp: 'Zeit'
			},
			{
				username: 'test2',
				content: 'Hier steht der andere Text',
				timestamp: 'Zeit'
			}
		],
		pagination: {
			records: 2,
			limit: 10,
			offset: 0
		}
	};

	const dataChats: ChatStructure = {
		chatId: '47c2a53c-c761-4e4c-99e0-75c084160ff4',
		users: [
			{
				username: 'test',
				nickname: 'test',
				profilePictureUrl: ''
			},
			{
				username: 'test2',
				nickname: 'test2',
				profilePictureUrl: ''
			}
		]
	};

	function closeModal() {
		modalStore.close();
	}
	function handleChatSearch() {}
</script>

<div class="card w-[60vw] h-[80vh] p-2">
	<header class="h-[7%]">123</header>
	<div class="flex flex-row gap-5 h-[93%]">
		<!-- linke Spalte -->
		<div class="h-full flex flex-col">
			<div class="bg-surface-500/30 p-4 h-1/6">
				<input
					class="input w-full"
					title={$t('chat.tooltip.search')}
					type="search"
					placeholder={$t('chat.placeholder.search')}
					on:input={handleChatSearch}
				/>
			</div>
			<div class="bg-surface-500/30 p-4 h-4/6">(list)</div>
			<div class="bg-surface-500/30 p-4 h-1/6 align-baseline">
				<button class="btn-sm variant-filled-primary rounded">
					{$t('chat.button.add')}
				</button>
			</div>
		</div>
		<!-- rechte Spalte -->
		<div class="bg-surface-500/30 flex flex-col w-3/4 h-full justify-between">
			<section class="w-full flex flex-col-reverse p-2">
				{#each dataMessages.records as message}
					{#if message.username === get(globalUsername)}
						<div class="flex float-end justify-end mt-2">
							<div class="card w-3/4 float-end p-4 variant-soft rounded-tr-none space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{message.username}</p>
									<small class="opacity-50">{message.timestamp}</small>
								</header>
								<p>{message.content}</p>
							</div>
						</div>
					{:else}
						<div class="flex flex-col gap-1 mt-2">
							<div class="card w-3/4 float-start p-4 rounded-tl-none space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{message.username}</p>
									<small class="opacity-50">{message.timestamp}</small>
								</header>
								<p>{message.content}</p>
							</div>
						</div>
					{/if}
				{/each}
			</section>
			<div class="bg-surface-500/30 p-4">
				<div class="input-group input-group-divider flex-row flex rounded-container-token">
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 w-11/12"
						name="prompt"
						id="prompt"
						placeholder={$t('chat.placeholder.input')}
						rows="1"
						maxlength="256"
					/>
					<button class="variant-filled-primary w-1/12">
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
