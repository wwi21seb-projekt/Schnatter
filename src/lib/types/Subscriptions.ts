import type { UUID } from 'crypto';
import type { PaginationUser } from './Pagination';
import type { Picture } from './Pictures';

export type Subscriptions = {
	records:
		| [
				{
					followerId: UUID;
					followingId: UUID;
					username: string;
					nickname: string;
					picture: Picture | undefined;
				}
		  ]
		| [];
	pagination: PaginationUser;
};
