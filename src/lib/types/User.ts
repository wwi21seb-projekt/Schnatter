import type { UUID } from 'crypto';
import type { Pagination } from './Pagination';

export type User = {
	username: string;
	nickname: string;
	status: string;
	profilePictureUrl: string | undefined;
	follower: number;
	following: number;
	posts: number;
	subscriptionId: UUID | string;
};

export type UserFetchResponse = {
	user: User;
	statusCode: number;
};

export type UsersForSearch = {
	records: User[];
	pagination: Pagination;
};
