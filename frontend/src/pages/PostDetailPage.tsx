import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { postApi } from "../api/post.api";
import { Header } from "../components/common/Header";
import { GoogleMapEmbed } from "../components/common/GoogleMapEmbed";

import {
   MapPin,
   ArrowLeft,
   PhoneCall,
   GraduationCap,
   Heart,
   ShieldCheck,
   ShieldAlert,
   ChevronRight,
   Play,
   Sparkles,
   MessageCircle,
   Share2,
   Layers,
   Zap,
   Droplets,
   Wifi,
   Clock,
   Copy,
   Check,
   AlertCircle,
   Maximize2,
   Banknote,
} from "lucide-react";

import { formatPrice } from "../utils/formatter.utils";
import { getAmenityIcon } from "../utils/icon.utils";
import { formatDescription } from "../utils/format-description";
import type { PostResponse, PostMediaResponse } from "../types/post/post-response";
import { Footer } from "../components/common/Footer";

export function PostDetailPage(): React.ReactElement {
   const { id } = useParams<{ id: string }>();
   const [post, setPost] = useState<PostResponse | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [activeMedia, setActiveMedia] = useState<PostMediaResponse | null>(null);
   const [isFavorite, setIsFavorite] = useState<boolean>(false);
   const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
   const [copiedShare, setCopiedShare] = useState<boolean>(false);

   // Tự động cuộn lên đầu trang lập tức khi mở bài viết mới
   useEffect(() => {
      window.scrollTo(0, 0);
   }, [id]);

   // Fetch thông tin bài đăng
   useEffect(() => {
      async function getPost() {
         if (!id) return;
         try {
            setLoading(true);
            const data = await postApi.getById(id);

            if (data) {
               setPost(data);
               if (data.medias && data.medias.length > 0) {
                  setActiveMedia(data.medias[0]);
               }
            }
         } catch (error) {
            console.error("Lỗi khi tải chi tiết bài đăng:", error);
         } finally {
            setLoading(false);
         }
      }

      getPost();
   }, [id]);

   // Inject Schema JSON-LD chuẩn cho Google Rich Results
   useEffect(() => {
      if (!post) return;

      const scriptId = "json-ld-schema-realestate";
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
         script = document.createElement("script");
         script.id = scriptId;
         script.type = "application/ld+json";
         document.head.appendChild(script);
      }

      script.innerHTML = JSON.stringify({
         "@context": "https://schema.org",
         "@type": "RealEstateListing",
         "name": post.title,
         "description": post.description?.substring(0, 160),
         "datePosted": post.createdAt,
         "offers": {
            "@type": "Offer",
            "price": post.price,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
         },
         "address": {
            "@type": "PostalAddress",
            "streetAddress": post.streetAddress
         }
      });

      return () => {
         const existingScript = document.getElementById(scriptId);
         if (existingScript) {
            document.head.removeChild(existingScript);
         }
      };
   }, [post]);

   function handleCopyPhone() {
      if (post?.contactPhone) {
         navigator.clipboard.writeText(post.contactPhone);
         setCopiedPhone(true);
         setTimeout(() => setCopiedPhone(false), 2000);
      }
   }

   function handleShare() {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
   }

   // FIX CLS: Skeleton chuẩn kích thước 1:1 với giao diện thực tế
   if (loading) {
      return (
         <div className="min-h-screen bg-slate-50/70 antialiased pb-24 lg:pb-12">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
               {/* Breadcrumb Skeleton khớp độ cao mb-5 */}
               <div className="h-4 bg-slate-200 rounded-md w-64 mb-5 animate-pulse" />

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* CỘT TRÁI */}
                  <div className="lg:col-span-2 space-y-6 min-w-0">
                     {/* Gallery Box Skeleton */}
                     <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs">
                        <div className="w-full aspect-video sm:aspect-[16/10] bg-slate-200 rounded-2xl animate-pulse" />
                        <div className="flex gap-2.5 mt-3.5 h-[84px] items-center">
                           <div className="w-20 h-20 bg-slate-200 rounded-xl animate-pulse" />
                           <div className="w-20 h-20 bg-slate-200 rounded-xl animate-pulse" />
                           <div className="w-20 h-20 bg-slate-200 rounded-xl animate-pulse" />
                        </div>
                     </div>

                     {/* Title Block Skeleton */}
                     <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex gap-2">
                           <div className="h-6 w-28 bg-slate-200 rounded-full animate-pulse" />
                           <div className="h-6 w-48 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                        <div className="h-7 bg-slate-200 rounded-xl w-5/6 animate-pulse" />
                        <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                           <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                           <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                           <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                        </div>
                     </div>
                  </div>

                  {/* CỘT PHẢI */}
                  <div>
                     <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                           <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
                           <div className="space-y-2 flex-1">
                              <div className="h-4 bg-slate-200 rounded-md w-3/4 animate-pulse" />
                              <div className="h-3 bg-slate-200 rounded-md w-1/2 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
                           <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      );
   }

   if (!post) {
      return (
         <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
               <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8" />
               </div>
               <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy bài đăng!</h2>
               <p className="text-slate-500 text-sm mb-6">Phòng trọ này có thể đã được cho thuê hoặc bài đăng đã bị gỡ.</p>
               <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
               >
                  <ArrowLeft className="w-4 h-4" /> Khám phá phòng trọ khác
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased pb-24 lg:pb-12">
         <Helmet>
            <title>{`${post.title} - Thuê phòng giá rẻ | SGHOUSES`}</title>
            <meta name="description" content={post.description?.substring(0, 160)} />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.description?.substring(0, 160)} />
            <meta property="og:image" content={activeMedia?.mediaUrl} />
         </Helmet>

         <Header />

         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none h-4">
               <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
               <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
               <Link to="/" className="hover:text-blue-600 transition-colors">{post.category?.name || "Cho thuê phòng trọ"}</Link>
               <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
               <span className="text-slate-900 font-semibold truncate max-w-[280px] sm:max-w-[400px]">{post.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* CỘT TRÁI */}
               <div className="lg:col-span-2 space-y-6 min-w-0">

                  {/* Gallery Xem Ảnh & Video */}
                  <section className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs relative">
                     <div className="relative w-full aspect-video sm:aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden group flex items-center justify-center shadow-inner">
                        {activeMedia?.mediaType === "VIDEO" ? (
                           <video controls autoPlay className="w-full h-full object-contain" src={activeMedia.mediaUrl}>
                              Trình duyệt không hỗ trợ thẻ video.
                           </video>
                        ) : (
                           <img
                              src={activeMedia?.mediaUrl || "https://via.placeholder.com/800x450?text=No+Image"}
                              alt={`${post.title} - Hình ảnh phòng trọ`}
                              loading="eager"
                              fetchPriority="high"
                              decoding="async"
                              width={800}
                              height={500}
                              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                           />
                        )}

                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                           <button
                              type="button"
                              onClick={handleShare}
                              className="p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-slate-700 transition-all shadow-md hover:scale-105 relative active:scale-95"
                              title="Chia sẻ bài viết"
                           >
                              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                           </button>
                           <button
                              type="button"
                              onClick={() => setIsFavorite(!isFavorite)}
                              className="p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-slate-700 transition-all shadow-md hover:scale-105 active:scale-95"
                              title="Lưu bài viết"
                           >
                              <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "text-rose-500 fill-rose-500" : ""}`} />
                           </button>
                        </div>

                        {post.medias && post.medias.length > 0 && (
                           <span className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                              <Layers className="w-3.5 h-3.5" />
                              {post.medias.findIndex((m) => m.id === activeMedia?.id) + 1} / {post.medias.length} Ảnh & Video
                           </span>
                        )}
                     </div>

                     {/* Carousel Thumbnails */}
                     {post.medias && post.medias.length > 1 && (
                        <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none min-h-[84px]">
                           {post.medias.map((media) => {
                              const isActive = activeMedia?.id === media.id;
                              return (
                                 <button
                                    type="button"
                                    key={media.id}
                                    onClick={() => setActiveMedia(media)}
                                    className={`relative w-20 h-20 shrink-0 bg-slate-100 rounded-xl overflow-hidden border-2 transition-all ${
                                       isActive ? "border-blue-600 ring-2 ring-blue-500/20 scale-95" : "border-transparent opacity-75 hover:opacity-100"
                                    }`}
                                 >
                                    {media.mediaType === "VIDEO" ? (
                                       <>
                                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white z-10">
                                             <Play className="w-5 h-5 fill-white" />
                                          </div>
                                          <video src={media.mediaUrl} className="w-full h-full object-cover" />
                                       </>
                                    ) : (
                                       <img src={media.mediaUrl} alt="Thu nhỏ phòng trọ" width={80} height={80} className="w-full h-full object-cover" loading="lazy" />
                                    )}
                                 </button>
                              );
                           })}
                        </div>
                     )}
                  </section>

                  {/* Tiêu đề & Thông số Nổi bật */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                     <div className="flex flex-wrap items-center gap-2">
                        {post.category && (
                           <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                              {post.category.name}
                           </span>
                        )}
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                           <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Phòng chính chủ - Đã xác minh
                        </span>
                     </div>

                     <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug break-words">
                        {post.title}
                     </h1>

                     <div className="flex items-start gap-2 text-slate-700 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed break-words">{post.streetAddress}</span>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                        <div className="bg-rose-50/80 border border-rose-200/80 p-3 rounded-xl flex items-center gap-2.5 min-w-0">
                           <div className="p-2 bg-rose-600 text-white rounded-lg shrink-0">
                              <Banknote className="w-4 h-4" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight leading-none">Giá cho thuê</p>
                              <p className="text-sm sm:text-base font-extrabold text-rose-700 mt-1 whitespace-normal break-words leading-tight">
                                 {formatPrice(post.price)}
                              </p>
                           </div>
                        </div>

                        <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl flex items-center gap-2.5 min-w-0">
                           <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                              <Maximize2 className="w-4 h-4" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight leading-none">Diện tích</p>
                              <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-1 leading-tight truncate">
                                 {post.area} m²
                              </p>
                           </div>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 min-w-0">
                           <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight leading-none">Tiền đặt cọc</p>
                              <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-1 whitespace-normal break-words leading-tight">
                                 {post.deposit ? formatPrice(post.deposit) : "Không cọc"}
                              </p>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Chi phí dịch vụ */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                     <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                           <Zap className="w-5 h-5" />
                        </div>
                        Bảng chi phí dịch vụ cố định
                     </h2>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                           <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Tiền điện
                           </div>
                           <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">3.800 đ/kWh</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                           <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                              <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Tiền nước
                           </div>
                           <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">100.000 đ/người</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                           <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                              <Wifi className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Internet
                           </div>
                           <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">Miễn phí</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                           <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Giờ giấc
                           </div>
                           <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">Tự do 24/7</p>
                        </div>
                     </div>
                  </section>

                  {/* Bản đồ Google Maps */}
                  {post.streetAddress && (
                     <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                              <MapPin className="w-5 h-5" />
                           </div>
                           Vị trí - Khu vực xung quanh
                        </h2>

                        <GoogleMapEmbed address={post.streetAddress} />
                     </section>
                  )}

                  {/* Trường ĐH lân cận */}
                  {post.universityNears && post.universityNears.length > 0 && (
                     <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                              <GraduationCap className="w-5 h-5" />
                           </div>
                           Trường Đại học - Cao đẳng
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {post.universityNears.map((university) => (
                              <div key={university.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl min-w-0">
                                 <span className="text-xs font-semibold text-slate-800 truncate pr-2" title={university.name}>{university.name}</span>
                                 <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl shrink-0 border border-indigo-100/60">
                                    ~ {university.distanceKm} km
                                 </span>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}

                  {/* Tiện nghi */}
                  {post.amenities && post.amenities.length > 0 && (
                     <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                           <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                              <Sparkles className="w-5 h-5" />
                           </div>
                           Tiện nghi và trang thiết bị phòng
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                           {post.amenities.map((item) => {
                              const IconComponent = getAmenityIcon(item.icon ?? '');
                              return (
                                 <div key={item.id} className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700 min-w-0">
                                    <div className="p-2 bg-white text-blue-600 rounded-xl shadow-xs shrink-0">
                                       <IconComponent className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">{item.name}</span>
                                 </div>
                              );
                           })}
                        </div>
                     </section>
                  )}

                  {/* Mô tả từ chủ nhà */}
                  <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                     <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                        Thông tin mô tả từ chủ nhà
                     </h2>
                     <article
                        className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-600 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 break-words"
                        dangerouslySetInnerHTML={{ __html: formatDescription(post.description || "") }}
                     />
                  </section>
               </div>

               {/* CỘT PHẢI: Khung Liên Hệ */}
               <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-24 space-y-6">
                     <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                           {post.user?.fullName ? post.user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                           <h3 className="font-bold text-base text-slate-900 truncate">{post.user?.fullName || "Chủ phòng trọ"}</h3>
                           <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mt-1">
                              <ShieldCheck className="w-3 h-3" /> Chủ nhà đáng tin cậy
                           </span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <a href={`tel:${post.contactPhone}`} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all text-sm">
                           <PhoneCall className="w-4 h-4 animate-bounce" />
                           <span>Gọi ngay: {post.contactPhone}</span>
                        </a>

                        <a href={`https://zalo.me/${post.contactPhone}`} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-all text-sm">
                           <MessageCircle className="w-4 h-4" />
                           <span>Nhắn tin Zalo trực tiếp</span>
                        </a>

                        <button type="button" onClick={handleCopyPhone} className="w-full bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-semibold py-3 px-4 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2 text-xs transition-colors">
                           {copiedPhone ? (
                              <>
                                 <Check className="w-3.5 h-3.5 text-emerald-600" />
                                 <span className="text-emerald-600 font-bold">Đã sao chép SĐT!</span>
                              </>
                           ) : (
                              <>
                                 <Copy className="w-3.5 h-3.5" />
                                 <span>Sao chép số điện thoại</span>
                              </>
                           )}
                        </button>
                     </div>

                     <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800">
                           <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> Lưu ý dành cho người thuê
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed text-[11px]">
                           <li>Đến trực tiếp kiểm tra phòng thực tế trước khi cọc.</li>
                           <li>Yêu cầu ký hợp đồng thuê trọ rõ ràng các điều khoản.</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* Mobile CTA Sticky Bar */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 flex items-center gap-3 shadow-2xl">
            <div className="flex-1 min-w-0">
               <p className="text-[10px] uppercase font-extrabold text-slate-400">Giá phòng</p>
               <p className="text-sm sm:text-base font-black text-rose-600 truncate">{formatPrice(post.price)}</p>
            </div>
            <a href={`tel:${post.contactPhone}`} className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md">
               <PhoneCall className="w-4 h-4" /> Gọi điện
            </a>
            <a href={`https://zalo.me/${post.contactPhone}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 active:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md">
               <MessageCircle className="w-4 h-4" /> Chat Zalo
            </a>
         </div>

         <Footer />
      </div>
   );
}