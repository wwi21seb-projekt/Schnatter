import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

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
