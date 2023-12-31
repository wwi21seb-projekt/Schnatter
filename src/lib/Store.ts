import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const registerUsername = writable('');

//https://server-beta.de/api
//https://alpha.c930.net/api
//http://localhost:3000
// local network http://192.168.0.126:3000/api
export const serverURL = writable('https://server-beta.de/api');

export const token = persisted('token', '');
export const refreshToken = persisted('refreshToken', '');
