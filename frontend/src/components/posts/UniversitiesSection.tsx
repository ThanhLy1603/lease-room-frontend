import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Plus, X, MapPin, Search, ChevronDown } from 'lucide-react';
import type { University } from '../../types/post/university';
import type { UniversityNear } from '../../hooks/usePostForm';

interface UniversitiesSectionProps {
   readonly universities: University[];
   readonly selectedUniId: string;
   readonly setSelectedUniId: (id: string) => void;
   readonly uniDistance: number | '';
   readonly setUniDistance: (dist: number | '') => void;
   readonly addedUniversities: UniversityNear[];
   readonly onAdd: () => void;
   readonly onRemove: (id: string) => void;
}

export default function UniversitiesSection({
   universities,
   selectedUniId,
   setSelectedUniId,
   uniDistance,
   setUniDistance,
   addedUniversities,
   onAdd,
   onRemove,
}: UniversitiesSectionProps): React.ReactElement {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const dropdownRef = useRef<HTMLDivElement>(null);

   const selectedUni = universities.find((u) => u.id === selectedUniId);

   const filteredUniversities = universities.filter((item) =>
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
      setSelectedUniId(id);
      setIsOpen(false);
      setSearchTerm('');
   }

   function preventInvalidNumberKeys(e: React.KeyboardEvent<HTMLInputElement>): void {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
         e.preventDefault();
      }
   }

   function handleClearSelect(e: React.MouseEvent) {
      e.stopPropagation();
      setSelectedUniId('');
      setSearchTerm('');
   }

   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Trường Đại Học Lân Cận
         </h2>

         <div className="space-y-3">
            {/* Custom Searchable Select Box */}
            <div className="relative" ref={dropdownRef}>
               <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between text-left"
               >
                  <span className={selectedUni ? 'text-slate-800 font-medium truncate pr-2' : 'text-slate-400'}>
                     {selectedUni ? selectedUni.name : '-- Chọn trường đại học --'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                     {selectedUni && (
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
                           placeholder="Nhập tên trường đại học..."
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
                        {filteredUniversities.length > 0 ? (
                           filteredUniversities.map((item) => {
                              const isAdded = addedUniversities.some((u) => u.universityId === item.id);
                              return (
                                 <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selectedUniId === item.id ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                                       }`}
                                 >
                                    <span className="truncate pr-2">{item.name}</span>
                                    {isAdded && (
                                       <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md shrink-0">
                                          Đã thêm
                                       </span>
                                    )}
                                 </button>
                              );
                           })
                        ) : (
                           <div className="p-3 text-xs text-center text-slate-400">Không tìm thấy trường phù hợp</div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* Input Khoảng Cách (Có nút xóa nhanh) */}
            <div className="flex gap-2">
               <div className="relative flex-1">
                  <input
                     type="number"
                     placeholder="Khoảng cách (km)"
                     step={0.1}
                     min={0}
                     onKeyDown={preventInvalidNumberKeys}
                     value={uniDistance}
                     onChange={(e) => setUniDistance(e.target.value ? Number(e.target.value) : '')}
                     className="w-full px-4 py-2.5 pr-8 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {uniDistance !== '' && (
                     <button
                        type="button"
                        onClick={() => setUniDistance('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        title="Xóa khoảng cách"
                     >
                        <X className="w-3.5 h-3.5" />
                     </button>
                  )}
               </div>

               <button
                  type="button"
                  onClick={onAdd}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
               >
                  <Plus className="w-4 h-4" /> Thêm
               </button>
            </div>
         </div>

         {/* Danh sách đã thêm */}
         <div className="space-y-2 pt-2">
            {addedUniversities.length > 0 ? (
               addedUniversities.map((item) => {
                  const uni = universities.find((u) => u.id === item.universityId);
                  return (
                     <div
                        key={item.universityId}
                        className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs font-medium text-slate-800"
                     >
                        <div className="flex items-center gap-2 truncate">
                           <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                           <span className="truncate">{uni?.name || item.universityId}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                           <span className="text-indigo-600 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {item.distanceKm} km
                           </span>
                           <button
                              type="button"
                              onClick={() => onRemove(item.universityId)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  );
               })
            ) : (
               <p className="text-xs text-slate-400 italic">Chưa chọn trường đại học lân cận nào.</p>
            )}
         </div>
      </div>
   );
}