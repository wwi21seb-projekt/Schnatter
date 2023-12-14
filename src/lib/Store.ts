import { writable } from 'svelte/store';

export const registerUsername = writable('');

//https://server-beta.de/api
// server-alpha Url
export const serverURL = writable('http://localhost:3000/api/v1');

export const token = writable('');
export const refreshToken = writable('');
