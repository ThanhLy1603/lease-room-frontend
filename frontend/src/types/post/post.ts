import type { Amenity } from "./amenity";
import type { Category } from "./category";
import type { User } from "./user";
import type { UniversityNear } from "./university-near";
import type { Media } from "./media";

export interface Post {
   id: string;
   title: string;
   description: string;
   price: number;
   area: number;
   deposit: number;
   provinceId: number; 
   districtId: number;
   wardId: number;
   streetAddress: string;
   contactPhone: string;
   user: User;
   category: Category;
   amenities: Amenity[];
   medias: Media[];
   universityNears: UniversityNear[];
}