import type {  PaginationUser } from "./Pagination"
import type { SubscriptionUser } from "./User"

export type Subscriptions= {
    records: [
        {
            subscriptionId: string,
            subscriptionDate: Date,
            user: SubscriptionUser
        }
    ]| [],
    pagination: PaginationUser
}