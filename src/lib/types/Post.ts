import type { UUID } from 'crypto';

export type PostStructure = {
	postID: UUID;
	author: {
		username: string;
		nickname: string;
		profilePictureUrl: string | undefined;
	};
	creationDate: Date;
	content: string;
};

export type TextColorPost = {
	isHashtag: boolean;
	text: string;
	wordID: number;
};
