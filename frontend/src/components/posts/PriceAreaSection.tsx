import React from 'react';
import { DollarSign, Maximize2, ShieldCheck } from 'lucide-react';
import type { PostFormData } from '../../hooks/usePostForm';

interface PriceAreaSectionProps {
   readonly formData: PostFormData;
   readonly errors: Record<string, string>;
   readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PriceAreaSection({
   formData,
   errors,
   onChange,
}: PriceAreaSectionProps): React.ReactElement {
   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Giá Cả & Diện Tích
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Giá cho thuê */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Giá cho thuê (VNĐ/tháng) <span className="text-rose-500">*</span>
               </label>
               <div className="relative">
                  <input
                     type="number"
                     name="price"
                     value={formData.price}
                     onChange={onChange}
                     placeholder="Ví dụ: 3500000"
                     min={0}
                     className={`w-full px-4 py-3 pl-10 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.price
                           ? 'border-rose-300 focus:ring-rose-400'
                           : 'border-slate-200 focus:ring-blue-500'
                     }`}
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               </div>
               {errors.price ? (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.price}</p>
               ) : (
                  formData.price !== '' && (
                     <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                        = {Number(formData.price).toLocaleString('vi-VN')} VNĐ
                     </p>
                  )
               )}
            </div>

            {/* Diện tích */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Diện tích (m²) <span className="text-rose-500">*</span>
               </label>
               <div className="relative">
                  <input
                     type="number"
                     name="area"
                     value={formData.area}
                     onChange={onChange}
                     placeholder="Ví dụ: 25"
                     min={0}
                     className={`w-full px-4 py-3 pl-10 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.area
                           ? 'border-rose-300 focus:ring-rose-400'
                           : 'border-slate-200 focus:ring-blue-500'
                     }`}
                  />
                  <Maximize2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               </div>
               {errors.area && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.area}</p>
               )}
            </div>

            {/* Tiền cọc */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tiền cọc (VNĐ)
               </label>
               <div className="relative">
                  <input
                     type="number"
                     name="deposit"
                     value={formData.deposit}
                     onChange={onChange}
                     placeholder="Ví dụ: 3500000"
                     min={0}
                     className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               </div>
               {formData.deposit !== '' && Number(formData.deposit) > 0 && (
                  <p className="mt-1.5 text-xs text-slate-500 font-medium">
                     = {Number(formData.deposit).toLocaleString('vi-VN')} VNĐ
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}