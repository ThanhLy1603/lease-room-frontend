export function getAuthHeaders() {
   const token = localStorage.getItem('accessToken');
   return {
      headers: {
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
   };
}