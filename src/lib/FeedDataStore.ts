import { writable } from 'svelte/store';
import type { GetFeedResponse } from '$lib/types/Feed.ts';
import type { PostStructure } from '$lib/types/Post.ts';

export const maxPostCounter = writable(0);
export const hasMorePosts = writable(true);
export const value = writable(false); // FeedType: true = personal, false = global
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
