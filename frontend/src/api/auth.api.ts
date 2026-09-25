import axios from "axios";
import type { Login } from '../types/auth/login';

export const authApi = {
   async login(login: Login): Promise<string> {
      const url = `http://localhost:8080/api/auth/login`;
      const payload = {
         phone: login.phone,
         password: login.password
      };

      const response = await axios.post(url, payload);

      return response.data.token;
   }
}