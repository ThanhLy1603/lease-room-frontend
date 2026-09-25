import React from 'react';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import type { Media } from '../../hooks/usePostForm';

interface MediaUploadSectionProps {
   readonly medias: Media[];
   readonly onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   readonly onRemoveMedia: (index: number) => void;
}

export default function MediaUploadSection({
   medias,
   onFileChange,
   onRemoveMedia,
}: MediaUploadSectionProps): React.ReactElement {
   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
         <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <Upload className="w-5 h-5 text-indigo-600" />
               Hình Ảnh - Video Thực Tế <span className="text-rose-500">*</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Đã tải lên: {medias.length} tệp</span>
         </div>

         {/* Tải tệp mới */}
         <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
            <input
               type="file"
               multiple
               accept="image/*,video/*"
               onChange={onFileChange}
               className="hidden"
            />
            <div className="p-3 bg-white rounded-full shadow-md text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-3">
               <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
               Nhấp để tải lên hình ảnh hoặc video
            </p>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ định dạng JPG, PNG, MP4 (Tối đa 10MB/tệp)</p>
         </label>

         {/* Danh sách Preview */}
         {medias.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {medias.map((item, index) => (
                  <div
                     key={index}
                     className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group shadow-sm"
                  >
                     {item.mediaType === 'VIDEO' ? (
                        <video src={item.mediaUrl} className="w-full h-full object-cover" />
                     ) : (
                        <img
                           src={item.mediaUrl}
                           alt={`upload-preview-${index}`}
                           className="w-full h-full object-cover"
                        />
                     )}

                     {/* Tag loại file */}
                     <span className="absolute left-2 top-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                        {item.mediaType === 'VIDEO' ? (
                           <Film className="w-3 h-3 text-amber-400" />
                        ) : (
                           <ImageIcon className="w-3 h-3 text-blue-400" />
                        )}
                        {item.mediaType}
                     </span>

                     {/* Nút xóa */}
                     <button
                        type="button"
                        onClick={() => onRemoveMedia(index)}
                        className="absolute right-2 top-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Xóa tệp này"
                     >
                        <X className="w-3.5 h-3.5" />
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}