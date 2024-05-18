import { serverURL } from '$lib/Store';
import type { CustomError } from '$lib/types/CustomError';
import { get } from 'svelte/store';
import type { Comment } from './types/Comment';

export async function fetchComments(token: string, limit: number, postId: string, offset: number ) {
    let customError: CustomError = {
		code: '',
		message: ''
	};

    let data: Comment ={
        records: [],
        pagination: {
            limit: 0,
            offset: 0,
            records: 0,
        }
    }

    const params = new URLSearchParams([
		['limit', limit.toString()],
        ['offset', offset.toString()]
	]);

    const fetchOptions: RequestInit ={
        method: 'GET',
        mode: 'cors'
    };

    if(token) {
        fetchOptions.headers = {
            Authorization: 'Bearer' + token
        }
    }

    const url: string = get(serverURL) + '/posts' + postId + params;

    const response = await fetch(url, fetchOptions);
}