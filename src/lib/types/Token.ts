export type TokenStructure = {
	exp: Date;
	iat: Date;
	refresh: boolean;
	username: string;
};

export type NewToken = {
	token: string;
	refreshToken: string;
};
