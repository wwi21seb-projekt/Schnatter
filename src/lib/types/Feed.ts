import type { PostStructure } from './Post';
import type { Pagination } from './FeedPagination';

export type FetchFeedResponse = {
	records: PostStructure[];
	pagination: Pagination;
};
