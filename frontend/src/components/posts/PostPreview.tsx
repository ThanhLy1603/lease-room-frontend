// src/components/post/PostPreview.tsx
import React from 'react';
import {
   Sparkles,
   Edit3,
   MapPin,
   DollarSign,
   Building2,
   Layers,
   Upload,
   Check,
   Phone,
   GraduationCap,
} from 'lucide-react';
import type { Category } from '../../types/post/category';
import type { Amenity } from '../../types/post/amenity';
import type { University } from '../../types/post/university';
import type { PostFormData } from '../../hooks/usePostForm';
import { formatDescription } from '../../utils/format-description';

interface PostPreviewProps {
   readonly formData: PostFormData;
   readonly categories: Category[];
   readonly amenities: Amenity[];
   readonly universities: University[];
   readonly onBackToEdit: () => void;
}

export default function PostPreview({
   formData,
   categories,
   amenities,
   universities,
   onBackToEdit,
}: PostPreviewProps): React.ReactElement {
   return (
      <div className="space-y-6">
         {/* Thông báo chế độ xem trước */}
         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
               <p className="text-sm font-medium">
                  Chế độ xem trước: Đây là giao diện hiển thị thực tế tới khách hàng.
               </p>
            </div>
            <button
               type="button"
               onClick={onBackToEdit}
               className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
               <Edit3 className="w-3.5 h-3.5" />
               Quay lại chỉnh sửa
            </button>
         </div>

         <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
            {/* Header thông tin bài đăng */}
            <div className="border-b border-slate-100 pb-6 space-y-3">
               <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100/50">
                     {categories.find((c) => c.id === formData.categoryId)?.name || 'Chưa chọn loại phòng'}
                  </span>

                  {/* Badge Số điện thoại liên hệ */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
                     <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                     <span>{formData.contactPhone || 'Chưa có SĐT'}</span>
                  </div>
               </div>

               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {formData.title || 'Tiêu đề bài đăng hiển thị tại đây'}
               </h1>

               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
                  <p className="flex items-center gap-1.5">
                     <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                     {formData.streetAddress
                        ? `${formData.streetAddress}, TP.HCM`
                        : 'Chưa nhập địa chỉ cụ thể'}
                  </p>
               </div>
            </div>

            {/* Thông số chính */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                     <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-medium">Giá cho thuê</p>
                     <p className="text-base sm:text-lg font-bold text-emerald-600">
                        {formData.price
                           ? `${Number(formData.price).toLocaleString('vi-VN')} đ/tháng`
                           : '0 đ'}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                     <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-medium">Diện tích</p>
                     <p className="text-base sm:text-lg font-bold text-slate-800">
                        {formData.area ? `${formData.area} m²` : '0 m²'}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                     <Layers className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-medium">Đặt cọc</p>
                     <p className="text-base sm:text-lg font-bold text-slate-800">
                        {formData.deposit
                           ? `${Number(formData.deposit).toLocaleString('vi-VN')} đ`
                           : '0 đ'}
                     </p>
                  </div>
               </div>
            </div>

            {/* Media */}
            <div className="space-y-3">
               <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" /> Hình Ảnh - Video Thực Tế ({formData.medias.length})
               </h3>
               {formData.medias.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {formData.medias.map((item, idx) => (
                        <div
                           key={idx}
                           className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group"
                        >
                           {item.mediaType === 'VIDEO' ? (
                              <video src={item.mediaUrl} controls className="w-full h-full object-cover" />
                           ) : (
                              <img src={item.mediaUrl} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                           )}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="h-36 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                     Chưa có hình ảnh/video nào
                  </div>
               )}
            </div>

            {/* Tiện ích */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
               <h3 className="font-bold text-slate-900 text-base">
                  <Sparkles className="w-5 h-5 text-amber-500" />Tiện Ích Nổi Bật
               </h3>
               <div className="flex flex-wrap gap-2">
                  {formData.amenityIds && formData.amenityIds.length > 0 ? (
                     formData.amenityIds.map((id) => (
                        <span
                           key={id}
                           className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200"
                        >
                           <Check className="w-3.5 h-3.5 text-blue-600" />
                           {amenities.find((a) => a.id === id)?.name || id}
                        </span>
                     ))
                  ) : (
                     <p className="text-slate-400 text-xs italic">Không có thông tin tiện ích</p>
                  )}
               </div>
            </div>

            {/* Trường Đại học lân cận */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
               <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Trường Đại Học Lân Cận
               </h3>
               <div className="flex flex-wrap gap-2">
                  {formData.universities && formData.universities.length > 0 ? (
                     formData.universities.map((uni) => (
                        <span
                           key={uni.universityId}
                           className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-100"
                        >
                           <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                           {universities.find((u) => u.id === uni.universityId)?.name || uni.universityId} - {uni.distanceKm} km
                        </span>
                     ))
                  ) : (
                     <p className="text-slate-400 text-xs italic">Không có thông tin trường đại học gần đây</p>
                  )}
               </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
               <h3 className="font-bold text-slate-900 text-base">Mô Tả Chi Tiết</h3>
               {formData.description ? (
                  <div
                     className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: formatDescription(formData.description) }}
                  />
               ) : (
                  <p className="text-slate-400 text-sm italic">Chưa có nội dung mô tả...</p>
               )}
            </div>
         </div>
      </div>
   );
}