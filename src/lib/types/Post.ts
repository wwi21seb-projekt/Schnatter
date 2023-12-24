import type { UUID } from 'crypto';

export type Post = {
	postID: UUID;
	author: {
		username: string;
		nickname: string;
		profilePictureUrl: string | undefined;
	};
	creationDate: Date;
	content: string;
};
