export type SubscriptionObject = {
    type: string;
    subscription: {
        endpoint: string
        p256dh: string
        auth: string
    }

};
