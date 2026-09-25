// src/components/post/PostHeader.tsx
import React from 'react';
import { Sparkles, Edit3, Eye } from 'lucide-react';

interface PostHeaderProps {
   activeTab: 'edit' | 'preview';
   setActiveTab: (tab: 'edit' | 'preview') => void;
}

export default function PostHeader({ activeTab, setActiveTab }: PostHeaderProps): React.ReactElement {
   return (
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
         {/* Tiêu đề trang */}
         <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <Sparkles className="w-6 h-6 text-blue-600" />
               Đăng Bài Cho Thuê Phòng
            </h1>
            <p className="text-sm text-slate-500 mt-1">
               Tiếp cận hàng nghìn khách hàng tìm phòng trọ mỗi ngày
            </p>
         </div>

         {/* Thanh chuyển Tab (Chỉnh sửa / Xem trước) */}
         <div className="flex bg-slate-100 p-1 rounded-xl w-fit shrink-0">
            <button
               type="button"
               onClick={() => setActiveTab('edit')}
               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'edit'
                     ? 'bg-white text-blue-600 shadow-sm'
                     : 'text-slate-600 hover:text-slate-900'
                  }`}
            >
               <Edit3 className="w-4 h-4" />
               Chỉnh sửa
            </button>
            <button
               type="button"
               onClick={() => setActiveTab('preview')}
               className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'preview'
                     ? 'bg-white text-blue-600 shadow-sm'
                     : 'text-slate-600 hover:text-slate-900'
                  }`}
            >
               <Eye className="w-4 h-4" />
               Xem trước
            </button>
         </div>
      </div>
   );
}