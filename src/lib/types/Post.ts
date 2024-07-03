import type { UUID } from 'crypto';
import type { Author } from './Author';
import type { Pagination } from './Pagination';
import type { GeoLocationCoords } from './GeoLocation';
import type { Picture } from './Pictures';

export type PostStructure = {
	postId: UUID;
	author: Author | undefined;
	creationDate: string;
	picture: Picture | undefined;
	content: string;
	likes: number;
	liked: boolean;
	repost: PostStructure | null;
	location: GeoLocationCoords | undefined;
	comments: number | undefined;
};

export type TextColorPost = {
	hashtagClass: string;
	text: string;
	wordID: number;
};

export type UserPostFetchResponse = {
	records: PostStructure[];
	pagination: Pagination;
	statusCode: number;
};

export interface RequestBodyData {
	content: string;
	location?: GeoLocationCoords;
	repostedPostId?: string;
	picture?: string;
}
