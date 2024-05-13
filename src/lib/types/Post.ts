import type { UUID } from 'crypto';
import type { Author } from './Author';
import type { Pagination } from './Pagination';
import type { GeoLocationCoords } from './GeoLocation';

export type PostStructure = {
	postId: UUID;
	author: Author;
	creationDate: string;
	content: string;
	likes: number;
	liked: boolean;
	location: GeoLocationCoords | undefined;
};

export type TextColorPost = {
	hashtagClass: string;
	text: string;
	wordID: number;
};

export type PostUserProfilStructure = {
	postId: UUID;
	creationDate: string;
	content: string;
	likes: number;
  liked: boolean;
	location: GeoLocationCoords | undefined;
};



export type UserPostFetchResponse = {
	records: PostUserProfilStructure[];
	pagination: Pagination;
	statusCode: number;
};
