import { writable } from 'svelte/store';
import type { GetFeedResponse } from '$lib/types/Feed.ts';
import type { PostStructure } from '$lib/types/Post.ts';

export const maxPostCounter = writable(0);
export const hasMorePosts = writable(true);
export const value = writable(false);
export const pageType = writable('home');
export const posts = writable<Array<PostStructure>>([]);
export const feedData = writable<GetFeedResponse>({
	records: [],
	pagination: {
		lastPostId: '',
		limit: 10,
		records: 0
	}
});
export const slotLimit = 10;

export const paramsChangeable = new URLSearchParams([
	['postId', ''],
	['limit', slotLimit.toString()],
	['feedType', 'global']
]);
export const paramsGlobalOnly = new URLSearchParams([
	['postId', ''],
	['limit', slotLimit.toString()]
]);
export const paramsHashtagSearch = new URLSearchParams([
	['q', 'ing'],
	['postId', ''],
	['limit', slotLimit.toString()]
]);
