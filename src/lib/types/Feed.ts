import type { Pagination } from "./Pagination"
import type { ProfilePostStructure } from "./Post"

export type ProfileFeed ={
    records: ProfilePostStructure[]
    pagination: Pagination
}