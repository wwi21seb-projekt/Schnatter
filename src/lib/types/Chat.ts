import type { UUID } from 'crypto';
import type { Pagination } from './Pagination';

export type ChatStructure = {
	chatId: UUID;
	users: ChatUser[];
};

export type ChatUser = {
	username: string;
	nickname: string;
	profilePictureUrl: string | undefined;
};

export type ChatMessages = {
	records: ChatMessage[];
	pagination: Pagination;
};

export type ChatMessage = {
	content: string;
	username: string;
	timestamp: string;
};

export type CreateChat = {
	chatId: UUID;
	message: ChatMessage;
};
