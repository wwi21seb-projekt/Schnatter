export type SubscriptionObject = {
	type: string;
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};
