//import type { UUID } from "crypto";

import type { Picture } from './Pictures';

export type NotificationEntity = {
	notificationId: string;
	timestamp: string;
	notificationType: string; //like, comment, repost,
	user: {
		username: string;
		nickname: string;
		picture: Picture | undefined;
	};
};

export type Notifications = {
	records: NotificationEntity[];
};
