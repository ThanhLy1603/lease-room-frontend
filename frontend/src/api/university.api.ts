import axios from 'axios';
import type { University } from '../types/post/university';
import { getAuthHeaders } from '../utils/api.utils';

export interface PaginatedUniversityResponse {
   data: University[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface QueryUniversity {
   keyword?: string;
   page?: number;
   limit?: number;
}

export interface CreateUniversityPayload {
   name: string;
   slug: string;
}

export interface UpdateUniversityPayload {
   name?: string;
   slug?: string;
}

const headers = getAuthHeaders();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const UNIVERSITY_API_URL = `${BASE_URL}/api/universities`;

export const universityApi = {

   async getAll(params?: QueryUniversity): Promise<PaginatedUniversityResponse> {
      const response = await axios.get<PaginatedUniversityResponse>(UNIVERSITY_API_URL, {
         params,
      });
      return response.data;
   },

   async getById(id: string): Promise<University> {
      const response = await axios.get<University>(`${UNIVERSITY_API_URL}/${id}`);
      return response.data;
   },

   async create(
      payload: CreateUniversityPayload
   ): Promise<University> {
      const response = await axios.post<University>(UNIVERSITY_API_URL, payload, headers);
      return response.data;
   },

   async update(
      id: string,
      payload: UpdateUniversityPayload
   ): Promise<University> {
      const response = await axios.put<University>(`${UNIVERSITY_API_URL}/${id}`, payload, headers);
      return response.data;
   },

   async delete(id: string): Promise<{ message: string }> {
      const response = await axios.delete<{ message: string }>(`${UNIVERSITY_API_URL}/${id}`, headers);
      return response.data;
   },
};