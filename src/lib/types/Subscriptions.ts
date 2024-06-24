import type { UUID } from 'crypto';
import type { Pagination } from './Pagination';
import type { Picture } from './Pictures';

export type Subscriptions = {
	records: records[];
	pagination: Pagination;
};

type records = {
	followerId: UUID;
	followingId: UUID;
	username: string;
	nickname: string;
	picture: Picture | undefined;
};
