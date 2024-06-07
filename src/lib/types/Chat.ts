import type { UUID } from 'crypto';
import type { Pagination } from './Pagination';
import type { Picture } from './Pictures';

export type ChatStructure = {
	records: { chatId: UUID; user: ChatUser }[];
};

export type ChatUser = {
	username: string;
	nickname: string;
	picture: Picture | undefined;
};

export type ChatMessages = {
	records: ChatMessage[];
	pagination: Pagination;
};

export type ChatMessage = {
	content: string;
	username: string;
	creationDate: string;
};

export type CreateChat = {
	chatId: UUID;
	message: ChatMessage;
};
