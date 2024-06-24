import type { PostStructure } from './Post';
import type { FeedPagination } from './Pagination';

export type Feed = {
	records: PostStructure[];
	pagination: FeedPagination;
};
