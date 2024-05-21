export type SubscriptionObject = {
	type: string;
	subscription: {
		endpoint: string;
		expirationTime: number | null;
		keys: {
			p256dh: string | ArrayBuffer | null;
			auth: string | ArrayBuffer | null;
		};
	};
};
