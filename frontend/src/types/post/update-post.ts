import type { CreatePost } from './create-post';

export interface UpdatePost extends Partial<CreatePost> {
   keepMediaIds?: string[];
}