// src/components/guards/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AdminRoute(): React.ReactElement {
   const { user, isLoading } = useAuth();
   const location = useLocation();

   // Đang trong quá trình tải/kiểm tra trạng thái xác thực
   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
               <span className="text-xs font-semibold text-slate-600">Đang kiểm tra quyền Admin...</span>
            </div>
         </div>
      );
   }

   // Chưa đăng nhập -> Chuyển hướng tới trang đăng nhập
   if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   // Đã đăng nhập -> Render giao diện Admin
   return <Outlet />;
}