import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Plus, X, Check, Search, ChevronDown } from 'lucide-react';
import type { Amenity } from '../../types/post/amenity';

interface AmenitiesSectionProps {
   readonly amenities: Amenity[];
   readonly selectedAmenityId: string;
   readonly setSelectedAmenityId: (id: string) => void;
   readonly selectedAmenityIds: string[];
   readonly onAdd: () => void;
   readonly onRemove: (id: string) => void;
}

export default function AmenitiesSection({
   amenities,
   selectedAmenityId,
   setSelectedAmenityId,
   selectedAmenityIds,
   onAdd,
   onRemove,
}: AmenitiesSectionProps): React.ReactElement {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const dropdownRef = useRef<HTMLDivElement>(null);

   const selectedAmenity = amenities.find((a) => a.id === selectedAmenityId);

   const filteredAmenities = amenities.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   function handleSelect(id: string) {
      setSelectedAmenityId(id);
      setIsOpen(false);
      setSearchTerm('');
   }

   function handleClearSelect(e: React.MouseEvent) {
      e.stopPropagation();
      setSelectedAmenityId('');
      setSearchTerm('');
   }

   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Tiện Ích Đi Kèm
         </h2>

         {/* Khối chọn và thêm */}
         <div className="flex gap-2 relative" ref={dropdownRef}>
            <div className="relative flex-1">
               <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between text-left"
               >
                  <span className={selectedAmenity ? 'text-slate-800 font-medium truncate' : 'text-slate-400'}>
                     {selectedAmenity ? selectedAmenity.name : '-- Chọn tiện ích --'}
                  </span>
                  <div className="flex items-center gap-1">
                     {selectedAmenity && (
                        <span
                           role="button"
                           tabIndex={0}
                           onClick={handleClearSelect}
                           className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                           title="Xóa lựa chọn"
                        >
                           <X className="w-3.5 h-3.5" />
                        </span>
                     )}
                     <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
               </button>

               {/* Dropdown Menu */}
               {isOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                     <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                        <input
                           type="text"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Nhập tên tiện ích..."
                           className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 pr-2"
                           autoFocus
                        />
                        {searchTerm && (
                           <button
                              type="button"
                              onClick={() => setSearchTerm('')}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                           >
                              <X className="w-3.5 h-3.5" />
                           </button>
                        )}
                     </div>

                     <div className="overflow-y-auto max-h-48 divide-y divide-slate-50">
                        {filteredAmenities.length > 0 ? (
                           filteredAmenities.map((item) => {
                              const isAdded = selectedAmenityIds.includes(item.id);
                              return (
                                 <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                       selectedAmenityId === item.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                 >
                                    <span>{item.name}</span>
                                    {isAdded && <span className="text-[10px] font-normal px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Đã thêm</span>}
                                 </button>
                              );
                           })
                        ) : (
                           <div className="p-3 text-xs text-center text-slate-400">Không tìm thấy tiện ích phù hợp</div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            <button
               type="button"
               onClick={onAdd}
               className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
               <Plus className="w-4 h-4" /> Thêm
            </button>
         </div>

         {/* Danh sách đã chọn */}
         <div className="flex flex-wrap gap-2 pt-2">
            {selectedAmenityIds.length > 0 ? (
               selectedAmenityIds.map((id) => {
                  const item = amenities.find((a) => a.id === id);
                  return (
                     <span
                        key={id}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/60 px-3 py-1.5 rounded-xl text-xs font-semibold"
                     >
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        {item?.name || id}
                        <button
                           type="button"
                           onClick={() => onRemove(id)}
                           className="hover:bg-blue-200/60 p-0.5 rounded-full transition-colors text-blue-600"
                        >
                           <X className="w-3.5 h-3.5" />
                        </button>
                     </span>
                  );
               })
            ) : (
               <p className="text-xs text-slate-400 italic">Chưa có tiện ích nào được thêm vào.</p>
            )}
         </div>
      </div>
   );
}