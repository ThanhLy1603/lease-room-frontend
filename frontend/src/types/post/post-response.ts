export interface UserResponse {
   id: string;
   fullName: string;
}

export interface CategoryResponse {
   id: string;
   name: string;
   slug: string;
}

export interface AmenityResponse {
   id: string;
   name: string;
   icon?: string;
}

export interface PostMediaResponse {
   id: string;
   mediaUrl: string;
   mediaType: 'IMAGE' | 'VIDEO';
}

export interface UniversityNearResponse {
   id: string;
   name: string;
   slug: string;
   distanceKm: number | null;
   latitude?: number;
   longitude?: number;
   provinceId?: number;
   districtId?: number;
}

export interface PostResponse {
   id: string;
   title: string;
   description: string;
   price: number;
   area: number;
   deposit: number;
   provinceId?: number;
   districtId?: number;
   wardId?: number;
   streetAddress: string;
   contactPhone: string;
   user?: UserResponse;
   category?: CategoryResponse;
   amenities: AmenityResponse[];
   medias: PostMediaResponse[];
   universityNears: UniversityNearResponse[];
   createdAt?: string;
   updatedAt?: string;
}