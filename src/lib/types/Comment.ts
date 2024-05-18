import type { UUID } from "crypto";
import type { Pagination } from "./Pagination";
import type { Author } from "./Author";

export type CommentStructure ={
    commentId: UUID;
    content: string;
    author: Author;
    creationDate: string;
};

export type Comment = {
    records: CommentStructure[];
    pagination: Pagination
}