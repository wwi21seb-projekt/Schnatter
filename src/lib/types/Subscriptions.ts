import type { UUID } from 'crypto';
import type { PaginationUser } from './Pagination';

export type Subscriptions = {
	records:
		| [
				{
					followerId: UUID;
					followingId: UUID;
					username: string;
					nickname: string;
					profilePictureUrl: string;
				}
		  ]
		| [];
	pagination: PaginationUser;
};
