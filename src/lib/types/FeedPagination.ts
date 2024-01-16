import type { UUID } from 'crypto';

export type Pagination = {
	lastPostId: UUID;
	limit: number;
	records: number;
};
