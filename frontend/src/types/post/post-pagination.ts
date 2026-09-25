import type { Post } from "./post";

export interface PostPagination {
   data: Post[];
   total: number;
   page: number;
   limit: number;
}