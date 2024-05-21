//import type { UUID } from "crypto";

export type NotificationEntity = {
	notificationId: string;
	timestamp: string;
	notificationType: string; //like, comment, repost,
	user: {
		username: string;
		nickname: string;
		profilePictureUrl: string | undefined;
	};
};

export type Notifications = {
	records: NotificationEntity[];
};
