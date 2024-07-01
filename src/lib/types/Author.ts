import type { Picture } from './Pictures';

export type Author = {
	username: string;
	nickname: string;
	picture: Picture | undefined;
};
