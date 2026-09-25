/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
   Search,
   RefreshCw,
   ChevronLeft,
   ChevronRight,
   Sparkles,
   Snowflake,
   Flame,
   Layers,
   Bed,
   Utensils,
   Blinds,
   Fingerprint,
   Video,
   ShieldCheck,
   ParkingCircle,
   ArrowUpDown,
   Wifi,
   Clock,
   Key,
   Wind,
   Dog,
   Sun,
   Waves,
   Dumbbell,
   Building,
   Shirt,
   HelpCircle
} from 'lucide-react';
import type { Amenity } from '../../types/post/amenity';
import { amenityApi } from '../../api/amenity.api';
import { notify } from '../../utils/notify.utils';

// Helper Map string icon name từ Backend thành Lucide Component tương ứng
function DynamicIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
   const iconMap: Record<string, React.ReactNode> = {
      snowflake: <Snowflake className={className} />,
      flame: <Flame className={className} />,
      layers: <Layers className={className} />,
      bed: <Bed className={className} />,
      blinds: <Blinds className={className} />,
      fingerprint: <Fingerprint className={className} />,
      video: <Video className={className} />,
      'shield-check': <ShieldCheck className={className} />,
      parking: <ParkingCircle className={className} />,
      'arrow-up-down': <ArrowUpDown className={className} />,
      wifi: <Wifi className={className} />,
      clock: <Clock className={className} />,
      key: <Key className={className} />,
      sparkles: <Sparkles className={className} />,
      wind: <Wind className={className} />,
      dog: <Dog className={className} />,
      sun: <Sun className={className} />,
      utensils: <Utensils className={className} />,
      waves: <Waves className={className} />,
      dumbbell: <Dumbbell className={className} />,
      building: <Building className={className} />,
      shirt: <Shirt className={className} />,
   };

   return iconMap[name] || <HelpCircle className={className} />;
}

export default function AdminAmenities(): React.ReactElement {
   // Data States
   const [amenities, setAmenities] = useState<Amenity[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   // Search & Pagination States
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [page, setPage] = useState<number>(1);
   const [limit, setLimit] = useState<number>(10);

   // 1. Fetch danh sách tiện ích
   const fetchAmenities = useCallback(async function () {
      setLoading(true);
      try {
         const data = await amenityApi.getAll();
         setAmenities(data || []);
      } catch (error: any) {
         notify.error('Lỗi khi tải danh sách tiện ích: ', error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchAmenities();
   }, [fetchAmenities]);

   // Reset tìm kiếm & trang
   function reset() {
      setSearchTerm('');
      setPage(1);
      fetchAmenities();
   }

   // Lọc theo từ khóa tìm kiếm
   const filteredAmenities = useMemo(() => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return amenities;
      return amenities.filter(
         (item) =>
            item.name.toLowerCase().includes(term) ||
            item.icon?.toLowerCase().includes(term)
      );
   }, [amenities, searchTerm]);

   // Phân trang Client
   const total = filteredAmenities.length;
   const totalPages = Math.ceil(total / limit) || 1;
   const paginatedAmenities = useMemo(() => {
      const startIndex = (page - 1) * limit;
      return filteredAmenities.slice(startIndex, startIndex + limit);
   }, [filteredAmenities, page, limit]);

   return (
      <div className="p-6 bg-slate-50 min-h-screen text-slate-800">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
               <h1 className="text-4xl font-bold text-slate-900">Quản lý tiện ích phòng trọ</h1>
               <p className="text-sm text-slate-500">
                  Danh sách các tiện nghi, trang thiết bị đi kèm bài đăng phòng trọ
               </p>
            </div>
            <button
               onClick={reset}
               disabled={loading}
               className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition shadow-sm font-medium text-sm disabled:opacity-50"
            >
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               Làm mới
            </button>
         </div>

         {/* Search Bar */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
               <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Tìm kiếm theo tên tiện ích, icon..."
                     value={searchTerm}
                     onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                     }}
                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
               </div>

               <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto">
                  <span>Hiển thị:</span>
                  <select
                     value={limit}
                     onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                     }}
                     className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                  >
                     <option value={10}>10 mục</option>
                     <option value={15}>15 mục</option>
                     <option value={20}>20 mục</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Data Table */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 w-16">STT</th>
                        <th className="py-3 px-4">Biểu tượng</th>
                        <th className="py-3 px-4">Tên tiện ích</th>
                        <th className="py-3 px-4">Mã Icon</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Đang tải dữ liệu...
                           </td>
                        </tr>
                     ) : paginatedAmenities.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Không tìm thấy tiện ích nào.
                           </td>
                        </tr>
                     ) : (
                        paginatedAmenities.map((amenity, index) => (
                           <tr key={amenity.id} className="hover:bg-slate-50 transition">
                              <td className="py-4 px-4 font-medium text-slate-400">
                                 {(page - 1) * limit + index + 1}
                              </td>

                              <td className="py-4 px-4">
                                 <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                                    <DynamicIcon name={amenity.icon} className="w-5 h-5" />
                                 </div>
                              </td>

                              <td className="py-4 px-4 font-semibold text-slate-900">
                                 {amenity.name}
                              </td>

                              <td className="py-4 px-4">
                                 <span className="font-mono text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md inline-block">
                                    {amenity.icon}
                                 </span>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
               <p className="text-xs text-slate-500">
                  Hiển thị <span className="font-semibold text-slate-700">{paginatedAmenities.length}</span> / <span className="font-semibold text-slate-700">{total}</span> tiện ích
               </p>
               <div className="flex items-center gap-2">
                  <button
                     onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                     disabled={page === 1}
                     className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-600 font-medium px-2">
                     Trang {page} / {totalPages}
                  </span>
                  <button
                     onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                     disabled={page >= totalPages}
                     className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}