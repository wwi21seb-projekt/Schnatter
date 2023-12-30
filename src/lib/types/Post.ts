import type { UUID } from 'crypto';
import type { Author } from './Author';

export type PostStructure = {
	postID: UUID;
	author: Author;
	creationDate: Date;
	content: string;
};

export type TextColorPost = {
	hashtagClass: string;
	text: string;
	wordID: number;
};

export type PostUserProfilStructure = {
	postID: UUID;
	creationDate: Date;
	content: string;
};

export type LikeObjectStructure = {
	likeCount: number;
	liked: boolean;
};
