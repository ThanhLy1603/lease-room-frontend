import axios from "axios"
import { getAuthHeaders } from "../utils/api.utils";
import type { AdminStats } from "../types/admin/admin-stats";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const adminApi = {
   async getDashboardStats(): Promise<AdminStats> {
      const headers = getAuthHeaders();

      const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, headers);

      console.log('AdminStats: ', response.data);
      return response.data;
   }
}