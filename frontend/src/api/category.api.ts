import axios from "axios";
import type { Category } from "../types/post/category";
import { getAuthHeaders } from "../utils/api.utils";

export interface CreateCategoryInput {
   name: string;
   slug: string;
}

export interface UpdateCategoryInput {
   name?: string;
   slug?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const CATEGORY_API_URL = `${BASE_URL}/api/categories`;

export const categoryApi = {
   async getAll(): Promise<Category[]> {
      const response = await axios.get<Category[]>(CATEGORY_API_URL);
      console.log("Categories fetched:", response.data);
      return response.data;
   },
   async create(data: CreateCategoryInput): Promise<Category> {
      const headers = getAuthHeaders();
      const response = await axios.post<Category>(CATEGORY_API_URL, data, headers);
      return response.data;
   },
   async update(id: string, data: UpdateCategoryInput): Promise<Category> {
      const headers = getAuthHeaders();
      const response = await axios.put<Category>(`${CATEGORY_API_URL}/${id}`, data, headers);
      return response.data;
   },
   async delete(id: string): Promise<{ message: string }> {
      const headers = getAuthHeaders();
      const response = await axios.delete<{ message: string }>(`${CATEGORY_API_URL}/${id}`, headers);
      return response.data;
   },
};