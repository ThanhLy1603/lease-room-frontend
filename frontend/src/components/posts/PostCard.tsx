import React, { useState } from 'react';
import type { Post } from '../../types/post/post';
import { Heart, MapPin, Play, GraduationCap, Phone, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '../../utils/formatter.utils';
import { getAmenityIcon } from '../../utils/icon.utils';
import { Link } from 'react-router-dom';

interface PostCardProps {
   readonly post: Post;
   readonly isPriority?: boolean;
}

// Ảnh đại diện mặc định khi không có media hoặc bị lỗi link
const DEFAULT_PLACEHOLDER =
   'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop';

export function PostCard({ post, isPriority = false }: PostCardProps): React.ReactElement {
   const [isFavorite, setIsFavorite] = useState<boolean>(false);
   const [imgSrc, setImgSrc] = useState<string>(() => {
      const firstImageObj = post.medias?.find((media) => media.mediaType === 'IMAGE');
      return firstImageObj?.mediaUrl || post.medias?.[0]?.mediaUrl || DEFAULT_PLACEHOLDER;
   });

   const hasVideo = post.medias?.some((media) => media.mediaType === 'VIDEO') ?? false;
   const mediaCount = post.medias?.length || 0;

   // Xử lý tiện ích
   const visibleAmenities = post.amenities?.slice(0, 4) || [];
   const extraAmenityCount = (post.amenities?.length || 0) - 4;

   // Đường dẫn trang chi tiết
   const detailUrl = `/${post.category?.slug || 'bai-dang'}/${post.id}`;

   return (
      <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group h-full">

         {/* Media Preview - Responsive Aspect Ratio */}
         <Link
            to={detailUrl}
            className="w-full sm:w-2/5 relative aspect-16/10 sm:aspect-auto sm:min-h-full bg-slate-100 overflow-hidden shrink-0 block"
         >
            <img
               src={imgSrc}
               alt={post.title}
               loading={isPriority ? 'eager' : 'lazy'}
               fetchPriority={isPriority ? 'high' : 'auto'}
               decoding="async"
               onError={() => setImgSrc(DEFAULT_PLACEHOLDER)}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Badge Loại Hình */}
            {post.category?.name && (
               <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md tracking-wider uppercase z-10">
                  {post.category.name}
               </span>
            )}

            {/* Favorite Button */}
            <button
               type="button"
               aria-label="Thêm vào yêu thích"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
               }}
               className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-slate-700 transition-colors shadow-xs z-10 active:scale-95"
            >
               <Heart
                  className={`w-4 h-4 transition-colors ${
                     isFavorite ? 'text-rose-500 fill-rose-500' : ''
                  }`}
               />
            </button>

            {/* Video & Media Count Badges */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
               {hasVideo ? (
                  <span className="flex items-center gap-1 bg-rose-600/90 backdrop-blur-md font-medium px-2 py-0.5 rounded-md text-[10px] sm:text-[11px]">
                     <Play className="w-3 h-3 fill-white" />
                     <span>Video</span>
                  </span>
               ) : mediaCount > 0 ? (
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium">
                     {mediaCount} ảnh
                  </span>
               ) : (
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                     <ImageIcon className="w-3 h-3" /> Chưa có ảnh
                  </span>
               )}
            </div>
         </Link>

         {/* Content Area */}
         <div className="p-3.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between min-w-0">
            <div>
               {/* Title */}
               <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug break-words">
                  <Link to={detailUrl}>{post.title}</Link>
               </h3>

               {/* Price & Area */}
               <div className="mt-2 flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-rose-600 tracking-tight">
                     {formatPrice(post.price)}
                  </span>

                  <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                     {post.area} m²
                  </span>
               </div>

               {/* Address */}
               <p className="mt-1.5 text-xs text-slate-500 flex items-start gap-1 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{post.streetAddress}</span>
               </p>

               {/* Nearby Universities */}
               {post.universityNears && post.universityNears.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200">
                     <div className="flex flex-wrap gap-1.5 items-center">
                        {post.universityNears.slice(0, 2).map((university) => (
                           <span
                              key={university.id}
                              className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium max-w-full"
                           >
                              <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate max-w-[120px] sm:max-w-[140px]" title={university.name}>
                                 {university.name}
                              </span>
                           </span>
                        ))}
                        {post.universityNears.length > 2 && (
                           <span className="text-[10px] text-slate-400 font-bold">
                              +{post.universityNears.length - 2}
                           </span>
                        )}
                     </div>
                  </div>
               )}

               {/* Description */}
               <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed break-words">
                  {post.description}
               </p>

               {/* Amenities */}
               {visibleAmenities.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                     {visibleAmenities.map((amenity) => {
                        const IconComponent = getAmenityIcon(amenity.icon);

                        return (
                           <span
                              key={amenity.id}
                              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-700 bg-blue-50/80 border border-blue-100 px-2 py-0.5 sm:py-1 rounded-md"
                           >
                              <IconComponent className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                           </span>
                        );
                     })}

                     {extraAmenityCount > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md self-center">
                           +{extraAmenityCount}
                        </span>
                     )}
                  </div>
               )}
            </div>

            {/* Footer Contact */}
            <div className="mt-3.5 pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
               <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                     {post.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  <span className="text-xs font-bold text-slate-700 truncate max-w-[90px] sm:max-w-[120px]">
                     {post.user?.fullName || 'Người dùng'}
                  </span>
               </div>

               <a
                  href={`tel:${post.contactPhone}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 sm:px-3 rounded-lg transition-colors shrink-0 active:scale-95"
               >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{post.contactPhone}</span>
               </a>
            </div>
         </div>
      </article>
   );
}