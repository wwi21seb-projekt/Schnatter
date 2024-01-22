import type { UUID } from 'crypto';

export type Pagination = {
	lastPostId: UUID | null;
	limit: number;
	records: number;
};
