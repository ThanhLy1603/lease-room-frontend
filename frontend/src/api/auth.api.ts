import axios from "axios";
import type { Login } from '../types/auth/login';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const authApi = {
   async login(login: Login): Promise<string> {
      const url = `${API_BASE_URL}/api/auth/login`;
      const payload = {
         phone: login.phone,
         password: login.password
      };

      const response = await axios.post(url, payload);

      return response.data.token;
   }
}