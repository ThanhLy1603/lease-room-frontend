import React from 'react';
import { MapPin } from 'lucide-react';
import type { PostFormData } from '../../hooks/usePostForm';

interface LocationSectionProps {
   readonly formData: PostFormData;
   readonly errors: Record<string, string>;
   readonly onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function LocationSection({
   formData,
   errors,
   onChange,
}: LocationSectionProps): React.ReactElement {
   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            Địa Chỉ Bất Động Sản
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tỉnh / Thành phố */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tỉnh / Thành phố
               </label>
               <select
                  name="provinceId"
                  value={formData.provinceId}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none cursor-not-allowed"
                  disabled
               >
                  <option value={79}>TP. Hồ Chí Minh</option>
               </select>
            </div>

            {/* Quận / Huyện */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quận / Huyện
               </label>
               <select
                  name="districtId"
                  value={formData.districtId}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  <option value={760}>Quận 1</option>
                  <option value={769}>Quận Thủ Đức / TP. Thủ Đức</option>
                  <option value={770}>Quận 7</option>
                  <option value={771}>Quận 10</option>
                  <option value={772}>Quận Bình Thạnh</option>
               </select>
            </div>

            {/* Phường / Xã */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phường / Xã
               </label>
               <select
                  name="wardId"
                  value={formData.wardId}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  <option value={26740}>Phường Bến Nghé</option>
                  <option value={26743}>Phường Bến Thành</option>
                  <option value={26746}>Phường Linh Trung</option>
               </select>
            </div>
         </div>

         {/* Số nhà & Tên đường */}
         <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
               Số nhà & Tên đường <span className="text-rose-500">*</span>
            </label>
            <input
               type="text"
               name="streetAddress"
               value={formData.streetAddress}
               onChange={onChange}
               placeholder="Ví dụ: 123/45 Nguyễn Văn Cừ, Phường 4"
               className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.streetAddress
                     ? 'border-rose-300 focus:ring-rose-400'
                     : 'border-slate-200 focus:ring-blue-500'
               }`}
            />
            {errors.streetAddress && (
               <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.streetAddress}</p>
            )}
         </div>
      </div>
   );
}