import axios from "axios";
import type { Amenity } from "../types/post/amenity";

export const amenityApi = {
   async getAll(): Promise<Amenity[]> {
      const response = await axios.get(`http://localhost:8080/api/amenities`);

      console.log('amenities: ', response.data);
      
      return response.data;
   }
}