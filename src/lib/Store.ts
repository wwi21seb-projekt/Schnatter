import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';
import type { Notifications } from './types/Notifications';
import type { UUID } from 'crypto';
import type { ChatStructure } from './types/Chat';

//https://server-beta.de/api
//https://alpha.c930.net/api
//http://localhost:3000/api
//Mockserver global
//https://projekt-mockserver.mabu2807.de/api
export const serverURL = persisted('serverURL', '');

// User
export const registerUsername = writable('');
export const token = persisted('token', '');
export const refreshToken = persisted('refreshToken', '');
export const globalUsername = persisted('globalUsername', '');

// chat
//persisted, because the last opened chat is displayed directly when the chat window is opened
export const chatIdNewChat = persisted('chatIdNewChat', '' as UUID | string);

// notifications

export const notificationCount = persisted('notificationCount', 0);

export const notificationList = persisted('notificationList', { records: [] } as Notifications);

// profilePicture
export const profilePicture = writable('');
export const newProfilePicture = writable<string | undefined>(undefined);

//helper

export const modalHiddenCss = writable('');

export const chats = writable({ records: [] } as ChatStructure);
