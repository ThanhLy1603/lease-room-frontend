import React from "react";
import { useEffect, useState } from "react";
import { postApi } from "../api/post.api";
import {
   ArrowUpDown,
   ChevronRight,
   ChevronLeft,
   Home,
   GraduationCap,
   Banknote,
   RotateCcw,
   Search,
   Inbox,
   FilterX
} from 'lucide-react';
import type { Category } from "../types/post/category";
import type { PostPagination } from '../types/post/post-pagination';
import { categoryApi } from "../api/category.api";
import { Header } from "../components/common/Header";
import type { University } from "../types/post/university";
import { universityApi, type PaginatedUniversityResponse } from "../api/university.api";
import type { Post } from "../types/post/post";
import { PostCard } from "../components/posts/PostCard";
import { Footer } from "../components/common/Footer";
import { parsePriceRange } from "../utils/parse.util";
import { useNavigate, useSearchParams } from "react-router-dom";

export function HomePage(): React.ReactElement {
   const navigate = useNavigate();

   const [postsPagination, setPostsPagination] = useState<PostPagination | null>(null);
   const [posts, setPosts] = useState<Post[] | null>(null);
   const [categories, setCategories] = useState<Category[] | null>(null);
   const [universities, setUniversities] = useState<University[] | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   // Filter States
   const [selectedCategory, setSelectedCategory] = useState<string>("");
   const [selectedUniversity, setSelectedUniversity] = useState<string>("");
   const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
   const [sortBy, setSortBy] = useState<string>("newest");

   const [currentPage, setCurrentPage] = useState<number>(1);
   const limit = 10;

   const [searchParams] = useSearchParams();
   const searchQuery = searchParams.get('search') || '';

   const totalPages = postsPagination ? Math.ceil(postsPagination.total / limit) : 1;

   useEffect(() => {
      document.title = "SGHOUSES - Tìm Phòng Trọ, Nhà Trọ Giá Rẻ Gần Trường Đại Học";

      if (posts && posts.length > 0) {
         const jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": posts.map((post, index) => ({
               "@type": "ListItem",
               "position": index + 1,
               "name": post.title,
               "url": `${window.location.origin}/posts/${post.id}`
            }))
         };

         const script = document.createElement("script");
         script.type = "application/ld+json";
         script.innerHTML = JSON.stringify(jsonLd);
         document.head.appendChild(script);

         return () => {
            script.remove();
         };
      }
   }, [posts]);

   function handlePageChange(page: number) {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
         setCurrentPage(page);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   }

   function handleResetFilter() {
      setSelectedCategory("");
      setSelectedUniversity("");
      setSelectedPriceRange("");
      setSortBy("newest");
      setCurrentPage(1);
      navigate("/");
   }

   useEffect(() => {
      async function getPosts() {
         try {
            setLoading(true);
            const { minPrice, maxPrice } = parsePriceRange(selectedPriceRange);

            const response = await postApi.getAll({
               page: currentPage,
               limit,
               search: searchQuery || undefined,
               categoryId: selectedCategory || undefined,
               universityId: selectedUniversity || undefined,
               minPrice,
               maxPrice,
               sortBy
            });

            setPostsPagination(response);
            setPosts(response.data);
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu bài đăng:", error);
         } finally {
            setLoading(false);
         }
      }

      getPosts();
   }, [currentPage, selectedCategory, selectedUniversity, selectedPriceRange, sortBy, searchQuery]);

   useEffect(() => {
      async function getCategories() {
         try {
            const data: Category[] = await categoryApi.getAll();
            setCategories(data);
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu loại phòng:", error);
         }
      }

      async function getUniversities() {
         try {
            const response: PaginatedUniversityResponse = await universityApi.getAll();
            setUniversities(response.data);
         } catch (error) {
            console.error("Lỗi khi tải dữ liệu các trường đại học / cao đẳng:", error);
         }
      }

      getCategories();
      getUniversities();
   }, []);

   const isFilterActive = selectedCategory || selectedUniversity || selectedPriceRange || searchQuery;

   return (
      <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col selection:bg-blue-500 selection:text-white">
         <Header />

         {/* Hero Banner Section */}
         <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 text-white py-8 sm:py-14 md:py-16 px-3 sm:px-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 right-0 sm:right-10 w-60 sm:w-80 h-60 sm:h-80 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
               <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3 leading-tight sm:leading-snug">
                  Cho Thuê Phòng Trọ Đẹp - Giá Rẻ
               </h1>
               <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-5 sm:mb-8 font-medium px-2">
                  Hàng nghìn căn hộ, phòng trọ gần các trường Đại học và Cao đẳng hàng đầu được cập nhật liên tục.
               </p>

               {/* Multi-Filter Search Card */}
               <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl shadow-slate-950/20 max-w-5xl mx-auto text-slate-800 border border-white/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">

                     {/* Category Filter */}
                     <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <Home className="w-4 h-4 text-blue-600 shrink-0 mr-2" />
                        <div className="flex flex-col w-full text-left">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Loại hình</span>
                           <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer truncate -ml-1 sm:ml-0"
                           >
                              <option value="">Tất cả loại hình</option>
                              {categories?.map((item) => (
                                 <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* University Filter */}
                     <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mr-2" />
                        <div className="flex flex-col w-full text-left">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Trường ĐH/CĐ</span>
                           <select
                              value={selectedUniversity}
                              onChange={(e) => setSelectedUniversity(e.target.value)}
                              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer truncate -ml-1 sm:ml-0"
                           >
                              <option value="">Trường ĐH - CĐ</option>
                              {universities?.map((item) => (
                                 <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Price Range Filter */}
                     <div className="relative flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <Banknote className="w-4 h-4 text-blue-600 shrink-0 mr-2" />
                        <div className="flex flex-col w-full text-left">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Mức giá</span>
                           <select
                              value={selectedPriceRange}
                              onChange={(e) => setSelectedPriceRange(e.target.value)}
                              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer -ml-1 sm:ml-0"
                           >
                              <option value="">Tất cả mức giá</option>
                              <option value="0-2">Dưới 2 triệu</option>
                              <option value="2-4">2 - 4 triệu</option>
                              <option value="4-7">4 - 7 triệu</option>
                              <option value="7-100">Trên 7 triệu</option>
                           </select>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex items-center gap-2">
                        <button
                           type="button"
                           onClick={() => setCurrentPage(1)}
                           className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl sm:rounded-2xl h-11 sm:h-full text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
                        >
                           <Search className="w-4 h-4" />
                           <span>Tìm kiếm</span>
                        </button>

                        {isFilterActive && (
                           <button
                              type="button"
                              onClick={handleResetFilter}
                              title="Xóa bộ lọc"
                              className="lg:hidden flex items-center justify-center h-11 w-11 shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-all"
                           >
                              <FilterX className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                  </div>

                  {/* Desktop Control Bar (Reset Filter) */}
                  {isFilterActive && (
                     <div className="hidden lg:flex mt-3 pt-3 border-t border-slate-100 items-center justify-between text-xs px-2">
                        <span className="text-slate-500 font-medium">Đang áp dụng bộ lọc nâng cao</span>
                        <button
                           type="button"
                           onClick={handleResetFilter}
                           className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors hover:underline"
                        >
                           <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mặc định
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* Main Content Area */}
         <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex-grow w-full">

            {/* Header List Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-slate-200/80">
               <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                     Danh sách tin đăng mới nhất
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                     {loading
                        ? 'Đang cập nhật danh sách phòng trọ...'
                        : `Hiển thị ${posts?.length || 0} trên tổng số ${postsPagination?.total || 0} phòng trọ`
                     }
                  </p>
               </div>

               {/* Sort Selector */}
               <div className="flex items-center justify-between sm:justify-start gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs w-full sm:w-auto">
                  <div className="flex items-center gap-1.5">
                     <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                     <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sắp xếp:</span>
                  </div>
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer text-right sm:text-left"
                  >
                     <option value="newest">Mới nhất</option>
                     <option value="price-asc">Giá từ thấp đến cao</option>
                     <option value="price-desc">Giá từ cao đến thấp</option>
                  </select>
               </div>
            </div>

            {/* Dynamic Posts Render & Skeleton Loading */}
            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                     <div key={idx} className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/60 animate-pulse flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="w-full sm:w-44 lg:w-48 h-44 sm:h-auto aspect-video sm:aspect-square bg-slate-200 rounded-xl sm:rounded-2xl shrink-0" />
                        <div className="flex-1 space-y-2.5 py-1">
                           <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                           <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                           <div className="h-3 bg-slate-200 rounded-md w-5/6" />
                           <div className="h-8 bg-slate-100 rounded-xl w-full mt-auto pt-2" />
                        </div>
                     </div>
                  ))}
               </div>
            ) : posts && posts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                  {posts.map((post, index) => (
                     <PostCard 
                        key={post.id} 
                        post={post}
                        isPriority={index < 2} 
                     />
                  ))}
               </div>
            ) : (
               /* Empty State */
               <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 max-w-md mx-auto my-6 sm:my-10 shadow-xs">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <Inbox className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Không tìm thấy bài đăng phù hợp</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                     Thử thay đổi điều kiện bộ lọc hoặc quay lại sau ít phút để cập nhật các tin mới nhất.
                  </p>
                  <button
                     type="button"
                     onClick={handleResetFilter}
                     className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                     <RotateCcw className="w-3.5 h-3.5" /> Đặt lại tất cả bộ lọc
                  </button>
               </div>
            )}

            {/* Responsive Pagination Bar */}
            {!loading && totalPages > 1 && (
               <div className="mt-8 sm:mt-12 flex items-center justify-center gap-1 sm:gap-2">
                  {/* Prev Button */}
                  <button
                     type="button"
                     onClick={() => handlePageChange(currentPage - 1)}
                     disabled={currentPage === 1}
                     className={`px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${currentPage === 1
                           ? 'border-slate-200 text-slate-300 bg-slate-100/50 cursor-not-allowed'
                           : 'border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 text-slate-700 bg-white shadow-xs'
                        }`}
                  >
                     <ChevronLeft className="w-4 h-4" />
                     <span className="hidden sm:inline">Trang trước</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                     {Array.from({ length: totalPages }, (_, index) => index + 1)
                        .filter(page => {
                           // Hiển thị thông minh trên di động để tránh tràn thanh phân trang
                           if (totalPages <= 5) return true;
                           return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                        })
                        .map((page, idx, arr) => {
                           const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                           return (
                              <React.Fragment key={page}>
                                 {showEllipsis && (
                                    <span className="px-1 text-slate-400 text-xs">...</span>
                                 )}
                                 <button
                                    type="button"
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                       }`}
                                 >
                                    {page}
                                 </button>
                              </React.Fragment>
                           );
                        })}
                  </div>

                  {/* Next Button */}
                  <button
                     type="button"
                     onClick={() => handlePageChange(currentPage + 1)}
                     disabled={currentPage === totalPages}
                     className={`px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${currentPage === totalPages
                           ? 'border-slate-200 text-slate-300 bg-slate-100/50 cursor-not-allowed'
                           : 'border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 text-slate-700 bg-white shadow-xs'
                        }`}
                  >
                     <span className="hidden sm:inline">Trang sau</span>
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            )}
         </main>

         {/* Footer Component */}
         <Footer />
      </div>
   );
}