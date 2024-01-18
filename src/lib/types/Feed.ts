import type { PostStructure } from './Post';
import type { Pagination } from './FeedPagination';

export type GetFeedResponse = {
	records: PostStructure[];
	pagination: Pagination;
};
