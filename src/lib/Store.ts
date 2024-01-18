import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const registerUsername = writable('');

//https://server-beta.de/api
//https://server-alpha.tech/api
//http://localhost:3000
// local network http://192.168.0.126:3000/api
export const serverURL = writable('http://localhost:3000/api');

export const token = persisted('token', '');
export const refreshToken = persisted('refreshToken', '');
