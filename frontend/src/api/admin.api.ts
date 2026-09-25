import axios from "axios"
import { getAuthHeaders } from "../utils/api.utils";
import type { AdminStats } from "../types/admin/admin-stats";

export const adminApi = {
   async getDashboardStats(): Promise<AdminStats> {
      const headers = getAuthHeaders();

      const response = await axios.get(`http://localhost:8080/api/admin/stats`, headers);

      console.log('AdminStats: ', response.data);
      return response.data;
   }
}