import { chatIdNewChat, serverURL, token } from '$lib/Store';
import type { ChatMessages, ChatStructure, CreateChat } from '$lib/types/Chat';
import type { UUID } from 'crypto';
import { get } from 'svelte/store';
import { handleRequestError } from './ErrorHandling';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';

export async function getChats(toastStore: ToastStore): Promise<ChatStructure> {
	const response = await fetch(`${get(serverURL)}/chats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.chat'));
	}
	const data: ChatStructure = (await response.json()) as ChatStructure;
	return data;
}

export async function getMessages(
	chatId: UUID | string,
	limit: number,
	offset: number,
	toastStore: ToastStore
): Promise<ChatMessages> {
	const params = new URLSearchParams([
		['limit', limit.toString()],
		['offset', offset.toString()]
	]);
	const response = await fetch(`${get(serverURL)}/chats/${chatId}?${params}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.chat'));
	}
	return (await response.json()) as ChatMessages;
}

export async function createChat(username: string, content: string, toastStore: ToastStore) {
	const response = await fetch(`${get(serverURL)}/chats`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		},
		body: JSON.stringify({
			username: username,
			content: content
		})
	});
	if (!response.ok) {
		handleRequestError(response.status, toastStore, get(t)('requestError.resourceType.chat'));
	}
	const newChat = (await response.json()) as CreateChat;
	//set the chatIdNewChat in the Store.ts
	chatIdNewChat.set(newChat.chatId);
}
