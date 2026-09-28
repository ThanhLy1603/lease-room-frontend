import axios from "axios";
import type { PostPagination } from "../types/post/post-pagination";
import type { CreatePost } from "../types/post/create-post";
import { getAuthHeaders } from "../utils/api.utils";
import type { PostResponse } from "../types/post/post-response";
import type { UpdatePost } from "../types/post/update-post";
import type { PostFilterParams } from "../types/post/post-filter-params.dto";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const POST_API_URL = `${BASE_URL}/api/posts`;

// Helper chuyển Payload thành FormData
const buildFormData = (data: Record<string, any>, files?: File[]): FormData => {
   const formData = new FormData();

   // 1. Append dữ liệu văn bản
   Object.keys(data).forEach((key) => {
      if (key === 'files') return; // Bỏ qua field files nếu bị trùng tên trong data

      const value = data[key];
      if (value !== undefined && value !== null) {
         if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
         } else {
            formData.append(key, String(value));
         }
      }
   });

   // 2. Append các file nhị phân vào key 'files'
   if (files && files.length > 0) {
      files.forEach((file) => {
         if (file instanceof File) {
            formData.append('files', file);
         }
      });
   }

   return formData;
};

export const postApi = {
   async getAll(params: PostFilterParams = {}): Promise<PostPagination> {
      const response = await axios.get<PostPagination>(POST_API_URL, {
         params,
      });
      return response.data;
   },

   async getById(id: string): Promise<PostResponse> {
      const response = await axios.get<PostResponse>(`${POST_API_URL}/${id}`);
      return response.data;
   },

   async create(data: CreatePost, files?: File[]): Promise<PostResponse> {
      const authHeaders = getAuthHeaders();
      const formData = buildFormData(data, files);

      const headers = { ...authHeaders.headers };

      const response = await axios.post<PostResponse>(POST_API_URL, formData, {
         headers,
      });
      return response.data;
   },

   async update(id: string, data: UpdatePost, files?: File[]): Promise<PostResponse> {
      const authHeaders = getAuthHeaders();
      const formData = buildFormData(data, files);

      const headers = { ...authHeaders.headers };

      const response = await axios.put<PostResponse>(`${POST_API_URL}/${id}`, formData, {
         headers,
      });
      return response.data;
   },

   async delete(id: string): Promise<{ message: string }> {
      const response = await axios.delete<{ message: string }>(
         `${POST_API_URL}/${id}`,
         getAuthHeaders()
      );
      return response.data;
   },
};