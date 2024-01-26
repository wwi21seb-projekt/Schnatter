import type { PostStructure } from './Post';
import type { Pagination } from './FeedPagination';

export type Feed = {
	records: PostStructure[];
	pagination: Pagination;
};
