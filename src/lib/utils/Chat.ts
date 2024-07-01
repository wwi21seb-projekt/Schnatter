import { chatIdNewChat, serverURL, token } from '$lib/Store';
import type { ChatMessages, ChatStructure, CreateChat } from '$lib/types/Chat';
import type { UUID } from 'crypto';
import { get } from 'svelte/store';

export async function getChats(): Promise<ChatStructure> {
	const response = await fetch(`${get(serverURL)}/chats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (!response.ok) {
		throw new Error('Failed to fetch chats');
	}
	const data: ChatStructure = (await response.json()) as ChatStructure;
	return data;
}

export async function getMessages(
	chatId: UUID,
	limit: number,
	offset: number
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
		throw new Error('Faild to fetch messages');
	}
	return (await response.json()) as ChatMessages;
}

export async function createChat(username: string, content: string) {
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
		throw new Error('Failed to create chat');
	}
	const newChat = (await response.json()) as CreateChat;
	chatIdNewChat.set(newChat.chatId);
}
