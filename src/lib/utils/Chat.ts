import { serverURL, token } from '$lib/Store';
import type { ChatStructure, CreateChat } from '$lib/types/Chat';
import type { UUID } from 'crypto';
import { get } from 'svelte/store';

export async function getChats(): Promise<ChatStructure> {
	const response = await fetch(`${get(serverURL)}/chat`, {
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

export async function getMessages(chatId: UUID, limit: number, offset: number): Promise<void> {
	const params = new URLSearchParams([
		['limit', limit.toString()],
		['offset', offset.toString()]
	]);

	const response = await fetch(`${get(serverURL)}/chat/${chatId}?${params}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(token)}`
		}
	});
	if (!response.ok) {
		throw new Error('Failed to create chat');
	}
}

export async function createChat(username: string, content: string): Promise<CreateChat> {
	const response = await fetch(`${get(serverURL)}/chat`, {
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
	return (await response.json()) as CreateChat;
}
