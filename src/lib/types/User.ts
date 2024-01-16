export type User = {
	username: string;
	nickname: string;
	status: string;
	profilePictureUrl: string | undefined;
	follower: number;
	following: number;
	posts: number;
};

export type UserFetchResponse = {
	user: User;
	statusCode: number;
};
