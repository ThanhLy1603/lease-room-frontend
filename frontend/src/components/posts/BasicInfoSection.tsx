// src/components/post/BasicInfoSection.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Phone, Building, Search, ChevronDown, X } from 'lucide-react';
import type { Category } from '../../types/post/category';
import type { PostFormData } from '../../hooks/usePostForm';

interface BasicInfoSectionProps {
   readonly formData: PostFormData;
   readonly categories: Category[];
   readonly errors: Record<string, string>;
   readonly onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function BasicInfoSection({
   formData,
   categories,
   errors,
   onChange,
}: BasicInfoSectionProps): React.ReactElement {
   const [isCatOpen, setIsCatOpen] = useState(false);
   const [catSearchTerm, setCatSearchTerm] = useState('');
   const catDropdownRef = useRef<HTMLDivElement>(null);

   const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);

   const filteredCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(catSearchTerm.toLowerCase())
   );

   // Tự động đóng dropdown danh mục khi click ra ngoài
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
            setIsCatOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Dispatch sự kiện onChange tiêu chuẩn cho categoryId
   const handleCategoryChange = (val: string) => {
      const syntheticEvent = {
         target: { name: 'categoryId', value: val },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
   };

   const handleSelectCategory = (catId: string) => {
      handleCategoryChange(catId);
      setIsCatOpen(false);
      setCatSearchTerm('');
   };

   const handleClearCategory = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCategoryChange('');
      setCatSearchTerm('');
   };

   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Thông Tin Cơ Bản
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loại phòng / Danh mục (Searchable & Clearable Dropdown) */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Loại phòng / Danh mục <span className="text-rose-500">*</span>
               </label>
               <div className="relative" ref={catDropdownRef}>
                  <button
                     type="button"
                     onClick={() => setIsCatOpen(!isCatOpen)}
                     className={`w-full px-4 py-3 rounded-xl border bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 flex items-center justify-between text-left transition-all ${
                        errors.categoryId
                           ? 'border-rose-300 focus:ring-rose-400'
                           : 'border-slate-200 focus:ring-blue-500'
                     }`}
                  >
                     <span className={selectedCategory ? 'text-slate-800 font-medium truncate pr-2' : 'text-slate-400'}>
                        {selectedCategory ? selectedCategory.name : '-- Chọn danh mục --'}
                     </span>
                     <div className="flex items-center gap-1 shrink-0">
                        {selectedCategory && (
                           <span
                              role="button"
                              tabIndex={0}
                              onClick={handleClearCategory}
                              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              title="Xóa lựa chọn"
                           >
                              <X className="w-3.5 h-3.5" />
                           </span>
                        )}
                        <Building className="w-4 h-4 text-slate-400" />
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                     </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isCatOpen && (
                     <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                           <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                           <input
                              type="text"
                              value={catSearchTerm}
                              onChange={(e) => setCatSearchTerm(e.target.value)}
                              placeholder="Tìm danh mục..."
                              className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 pr-2"
                              autoFocus
                           />
                           {catSearchTerm && (
                              <button
                                 type="button"
                                 onClick={() => setCatSearchTerm('')}
                                 className="text-slate-400 hover:text-slate-600 p-0.5"
                              >
                                 <X className="w-3.5 h-3.5" />
                              </button>
                           )}
                        </div>

                        <div className="overflow-y-auto max-h-48 divide-y divide-slate-50">
                           {filteredCategories.length > 0 ? (
                              filteredCategories.map((cat) => (
                                 <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleSelectCategory(cat.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                       formData.categoryId === cat.id
                                          ? 'bg-blue-50 text-blue-600 font-semibold'
                                          : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                 >
                                    <span className="truncate">{cat.name}</span>
                                 </button>
                              ))
                           ) : (
                              <div className="p-3 text-xs text-center text-slate-400">Không tìm thấy danh mục phù hợp</div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
               {errors.categoryId && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.categoryId}</p>
               )}
            </div>

            {/* Số điện thoại liên hệ */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
               </label>
               <div className="relative">
                  <input
                     type="text"
                     name="contactPhone"
                     value={formData.contactPhone}
                     onChange={onChange}
                     placeholder="Ví dụ: 0901234567"
                     className={`w-full px-4 py-3 pl-10 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.contactPhone
                           ? 'border-rose-300 focus:ring-rose-400'
                           : 'border-slate-200 focus:ring-blue-500'
                     }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
               </div>
               {errors.contactPhone && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.contactPhone}</p>
               )}
            </div>
         </div>

         {/* Tiêu đề bài đăng */}
         <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
               Tiêu đề bài đăng <span className="text-rose-500">*</span>
            </label>
            <input
               type="text"
               name="title"
               value={formData.title}
               onChange={onChange}
               maxLength={120}
               placeholder="Ví dụ: Phòng trọ cao cấp full nội thất gần Đại học Bách Khoa"
               className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                     ? 'border-rose-300 focus:ring-rose-400'
                     : 'border-slate-200 focus:ring-blue-500'
               }`}
            />
            <div className="flex items-center justify-between mt-1.5">
               {errors.title ? (
                  <p className="text-xs text-rose-500 font-medium">{errors.title}</p>
               ) : (
                  <span />
               )}
               <span className="text-xs text-slate-400">{formData.title.length}/120 ký tự</span>
            </div>
         </div>
      </div>
   );
}