import { writable } from 'svelte/store';
import type { GetFeedResponse } from '$lib/types/Feed.ts';
import type { PostStructure } from '$lib/types/Post.ts';
import { URLSearchParams } from 'url';

export const maxPostCounter = writable(0);
export const hasMorePosts = writable(true);
export const value = writable(0);
export const feedType = writable('global');
export const posts = writable<Array<PostStructure>>([]);
export const feedData = writable<GetFeedResponse>({
	records: [],
	pagination: {
		lastPostId: null,
		limit: 10,
		records: 0
	}
});
export const slotLimit = writable(10);

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
