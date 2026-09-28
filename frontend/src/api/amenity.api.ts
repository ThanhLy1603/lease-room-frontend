import axios from "axios";
import type { Amenity } from "../types/post/amenity";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const amenityApi = {
   async getAll(): Promise<Amenity[]> {
      const response = await axios.get(`${API_BASE_URL}/api/amenities`);

      console.log('amenities: ', response.data);
      
      return response.data;
   }
}