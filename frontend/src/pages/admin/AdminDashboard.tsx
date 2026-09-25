import React, { useEffect, useState } from 'react';
import { FileText, GraduationCap, Grid, FolderTree } from 'lucide-react';
import type { AdminStats } from '../../types/admin/admin-stats';
import { adminApi } from '../../api/admin.api';

export default function AdminDashboard(): React.ReactElement {
   const [statsData, setStatsData] = useState<AdminStats>({
      totalPosts: 0,
      totalUniversities: 0,
      totalAmenities: 0,
      totalCategories: 0,
   });
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      async function getStats() {
         try {
            setIsLoading(true);
            const data = await adminApi.getDashboardStats();
            setStatsData(data);
         } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thống kê:', error);
         } finally {
            setIsLoading(false);
         }
      }

      getStats();
   }, []);

   const stats = [
      {
         label: 'Tổng tin đăng',
         value: isLoading ? '...' : (statsData?.totalPosts ?? 0).toLocaleString('vi-VN'),
         icon: FileText,
         color: 'text-blue-600',
         bg: 'bg-blue-50',
      },
      {
         label: 'Trường Đại Học',
         value: isLoading ? '...' : (statsData?.totalUniversities ?? 0).toLocaleString('vi-VN'),
         icon: GraduationCap,
         color: 'text-indigo-600',
         bg: 'bg-indigo-50',
      },
      {
         label: 'Tiện ích hệ thống',
         value: isLoading ? '...' : (statsData?.totalAmenities ?? 0).toLocaleString('vi-VN'),
         icon: Grid,
         color: 'text-emerald-600',
         bg: 'bg-emerald-50',
      },
      {
         label: 'Danh mục phòng',
         value: isLoading ? '...' : (statsData?.totalCategories ?? 0).toLocaleString('vi-VN'),
         icon: FolderTree,
         color: 'text-amber-600',
         bg: 'bg-amber-50',
      },
   ];

   return (
      <div className="space-y-6">
         {/* Banner chào mừng */}
         <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg shadow-blue-950/10">
            <h2 className="text-xl font-black mb-1">Xin chào Quản trị viên!</h2>
            <p className="text-xs text-blue-100 font-medium">
               Quản lý danh mục, bài đăng và thông tin trường đại học một cách nhanh chóng.
            </p>
         </div>

         {/* Các ô Thống kê */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => {
               const Icon = s.icon;
               return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                     <div>
                        <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{s.value}</p>
                     </div>
                     <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}