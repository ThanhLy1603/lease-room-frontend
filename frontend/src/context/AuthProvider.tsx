import React, { useState } from 'react';
import { AuthContext, type UserPayload } from './AuthContext';

function parseJwt(token: string): UserPayload | null {
   try {
      if (!token || token === 'undefined' || token === 'null') return null;
      
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
         atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
      );

      // Kiểm tra trước khi parse
      if (!jsonPayload || jsonPayload === 'undefined') return null;

      return JSON.parse(jsonPayload);
   } catch (error) {
      console.error('Lỗi decode JWT token:', error);
      return null;
   }
}

export function AuthProvider({ children }: { readonly children: React.ReactNode }): React.ReactElement {
   // Khởi tạo state trực tiếp từ localStorage -> Không cần useEffect -> Không bị lỗi ESLint
   const [user, setUser] = useState<UserPayload | null>(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
         const userData = parseJwt(token);
         if (userData) return userData;
         localStorage.removeItem('accessToken');
      }
      return null;
   });

   const [isLoading] = useState<boolean>(false);

   function login(token: string): void {
      localStorage.setItem('accessToken', token);
      const userData = parseJwt(token);
      setUser(userData);
   }

   function logout(): void {
      localStorage.removeItem('accessToken');
      setUser(null);
   }

   return (
      <AuthContext.Provider value={{ user, isLoading, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
}