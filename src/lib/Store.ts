import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';
import type { Notifications } from './types/Notifications';
import type { UUID } from 'crypto';

export const registerUsername = writable('');

//https://server-beta.de/api
//https://server-alpha.tech/api
//http://localhost:3000/api
//Mockserver global
//https://projekt-mockserver.mabu2807.de/api
export const serverURL = writable('https://server-beta.de/api');

export const token = persisted('token', '');
export const refreshToken = persisted('refreshToken', '');
export const globalUsername = persisted('globalUsername', '');
export const chatIdNewChat = persisted('chatIdNewChat', '' as UUID);

// notifications

export const notificationCount = persisted('notificationCount', 0);

export const notificationList = persisted('notificationList', { records: [] } as Notifications);

// profilePicture
export const profilePicture = writable('');
