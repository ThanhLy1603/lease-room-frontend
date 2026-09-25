import type { CreatePostMedia } from "./create-post-media";
import type { CreatePostUniversity } from "./create-post-university";

export interface CreatePost {
   categoryId: string;
   title: string;
   description?: string;
   price: number;
   area: number;
   deposit: number;
   provinceId?: number;
   districtId?: number;
   wardId?: number;
   streetAddress: string;
   contactPhone: string;
   amenityIds?: string[];
   medias?: CreatePostMedia[];
   universities?: CreatePostUniversity[]
}