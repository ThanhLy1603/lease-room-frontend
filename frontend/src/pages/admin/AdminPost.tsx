import React, { useState, useEffect, useMemo } from 'react';
import {
   Search,
   Eye,
   Trash2,
   RefreshCw,
   MapPin,
   Phone,
   User,
   Tag,
   CheckCircle2,
   X,
   Edit3,
   ChevronLeft,
   ChevronRight,
} from 'lucide-react';
import { postApi } from '../../api/post.api';
import type { CategoryResponse, PostResponse } from '../../types/post/post-response';
import { notify } from '../../utils/notify.utils';
import type { PostPagination } from '../../types/post/post-pagination';
import { formatPrice } from '../../utils/formatter.utils';
import type { Category } from '../../types/post/category';
import { categoryApi } from '../../api/category.api';
import { Link } from 'react-router-dom';

export default function AdminPost(): React.ReactElement {
   const [posts, setPosts] = useState<PostResponse[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

   // Pagination State
   const [page, setPage] = useState<number>(1);
   const [limit] = useState<number>(10);
   const [total, setTotal] = useState<number>(0);

   // Modal States
   const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
   const [deleteId, setDeleteId] = useState<string | null>(null);

   useEffect(() => {
      async function getPost() {
         try {
            setLoading(true);
            const response: PostPagination = await postApi.getAll({
               page,
               limit,
               search: searchTerm || undefined
            });

            setPosts(response.data || []);
            setTotal(response.total || 0);
         } catch (error: any) {
            notify.error('Lỗi khi tải danh sách bài đăng: ', error);
         } finally {
            setLoading(false);
         }
      }

      async function getCategories() {
         try {
            const response: CategoryResponse[] = await categoryApi.getAll();
            setCategories(response);
         } catch (error: any) {
            notify.error('Lỗi khi lấy danh sách Categories: ', error);
         }
      }

      getPost();
      getCategories();
   }, [page, limit, searchTerm]);

   function reset() {
      setSearchTerm('');
      setPage(1);
      setSelectedCategory('ALL');
   }

   async function handleDelete() {
      if (!deleteId) return;
      try {
         await postApi.delete(deleteId);
         setDeleteId(null);
         notify.success('Xóa bài đăng thành công');
         reset();
      } catch (error: any) {
         notify.error('Lỗi khi xóa bài đăng:', error);
      }
   }

   const filteredPosts = useMemo(() => {
      if (selectedCategory === 'ALL') return posts;
      return posts.filter((post) => post.category?.id === selectedCategory);
   }, [posts, selectedCategory]);

   const totalPages = Math.ceil(total / limit) || 1;

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Quản lý bài đăng phòng trọ
               </h1>
               <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Danh sách tất cả tin đăng phòng trọ, căn hộ trên hệ thống
               </p>
            </div>
            <button
               onClick={reset}
               disabled={loading}
               className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs font-semibold text-xs sm:text-sm disabled:opacity-50 active:scale-95 self-start sm:self-auto"
            >
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
               <span>Làm mới</span>
            </button>
         </div>

         {/* Filter & Search Bar */}
         <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
               {/* Search Input */}
               <div className="relative w-full md:w-80 lg:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Tìm kiếm tiêu đề, địa chỉ..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
               </div>

               {/* Category Filter Pills */}
               <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                  <button
                     onClick={() => setSelectedCategory('ALL')}
                     className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedCategory === 'ALL'
                           ? 'bg-blue-600 text-white shadow-xs'
                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                     }`}
                  >
                     Tất cả
                  </button>
                  {categories.map((cat) => (
                     <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                           selectedCategory === cat.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                     >
                        {cat.name}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Data Display Area */}
         <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            
            {/* 1. Mobile & Tablet Card View (< 1024px) */}
            <div className="block lg:hidden divide-y divide-slate-100">
               {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">Đang tải dữ liệu...</div>
               ) : filteredPosts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">Không tìm thấy bài đăng nào.</div>
               ) : (
                  filteredPosts.map((post) => (
                     <div key={post.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                              <Tag className="w-3 h-3" />
                              {post.category?.name || 'Khác'}
                           </span>
                           <span className="font-extrabold text-emerald-600 text-sm">
                              {formatPrice(post.price)}/tháng
                           </span>
                        </div>

                        <div>
                           <h3
                              onClick={() => setSelectedPost(post)}
                              className="font-bold text-slate-900 text-sm line-clamp-2 active:text-blue-600"
                           >
                              {post.title}
                           </h3>
                           <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{post.streetAddress}</span>
                           </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                           <div className="flex items-center gap-1 font-medium">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {post.user?.fullName || 'N/A'}
                           </div>
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => setSelectedPost(post)}
                                 className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                              >
                                 <Eye className="w-4 h-4" />
                              </button>
                              <Link
                                 to={`/edit-post/${post.id}`}
                                 className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-amber-50 hover:text-amber-600"
                              >
                                 <Edit3 className="w-4 h-4" />
                              </Link>
                              <button
                                 onClick={() => setDeleteId(post.id)}
                                 className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-rose-50 hover:text-rose-600"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* 2. Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block overflow-x-auto">
               <table className="w-full text-left text-sm border-collapse">
                  <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-4">Bài đăng</th>
                        <th className="py-3.5 px-4">Danh mục</th>
                        <th className="py-3.5 px-4">Giá & Diện tích</th>
                        <th className="py-3.5 px-4">Chủ tin</th>
                        <th className="py-3.5 px-4">Tiện ích</th>
                        <th className="py-3.5 px-4 text-center">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="text-center py-12 text-slate-400">
                              Đang tải dữ liệu...
                           </td>
                        </tr>
                     ) : filteredPosts.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="text-center py-12 text-slate-400">
                              Không tìm thấy bài đăng nào.
                           </td>
                        </tr>
                     ) : (
                        filteredPosts.map((post) => (
                           <tr key={post.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-4 px-4 max-w-xs">
                                 <p
                                    className="font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition cursor-pointer"
                                    onClick={() => setSelectedPost(post)}
                                 >
                                    {post.title}
                                 </p>
                                 <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                    <span className="truncate">{post.streetAddress}</span>
                                 </div>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                    <Tag className="w-3 h-3" />
                                    {post.category?.name || 'Khác'}
                                 </span>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                 <p className="font-extrabold text-emerald-600">{formatPrice(post.price)}/tháng</p>
                                 <p className="text-xs text-slate-500 mt-0.5">{post.area} m² | Cọc: {formatPrice(post.deposit)}</p>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                 <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    {post.user?.fullName || 'N/A'}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    {post.contactPhone}
                                 </div>
                              </td>

                              <td className="py-4 px-4">
                                 <div className="flex flex-wrap gap-1 max-w-xs">
                                    {post.amenities?.slice(0, 2).map((a) => (
                                       <span key={a.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">
                                          {a.name}
                                       </span>
                                    ))}
                                    {post.amenities?.length > 2 && (
                                       <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                          +{post.amenities.length - 2}
                                       </span>
                                    )}
                                 </div>
                              </td>

                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                 <div className="flex items-center justify-center gap-1.5">
                                    <button
                                       type="button"
                                       onClick={() => setSelectedPost(post)}
                                       className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl transition-all"
                                       title="Xem chi tiết"
                                    >
                                       <Eye className="w-4 h-4" />
                                    </button>
                                    <Link
                                       to={`/edit-post/${post.id}`}
                                       className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-xl transition-all"
                                       title="Chỉnh sửa"
                                    >
                                       <Edit3 className="w-4 h-4" />
                                    </Link>
                                    <button
                                       type="button"
                                       onClick={() => setDeleteId(post.id)}
                                       className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-all"
                                       title="Xóa bài đăng"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200/80">
               <p className="text-xs text-slate-500">
                  Hiển thị <span className="font-bold text-slate-700">{filteredPosts.length}</span> / <span className="font-bold text-slate-700">{total}</span> bài đăng
               </p>
               <div className="flex items-center gap-2">
                  <button
                     onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                     disabled={page === 1}
                     className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 shadow-xs"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-700 font-bold px-2">
                     Trang {page} / {totalPages}
                  </span>
                  <button
                     onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                     disabled={page >= totalPages}
                     className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 shadow-xs"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* --- Detail Modal --- */}
         {selectedPost && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                     <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Chi tiết bài đăng</h2>
                     <button
                        onClick={() => setSelectedPost(null)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm">
                     <div>
                        <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-full mb-1.5">
                           {selectedPost.category?.name}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedPost.title}</h3>
                        <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                           <MapPin className="w-3.5 h-3.5 shrink-0" />
                           {selectedPost.streetAddress}
                        </p>
                     </div>

                     <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div>
                           <p className="text-[10px] sm:text-xs text-slate-500">Giá thuê</p>
                           <p className="font-extrabold text-emerald-600 text-xs sm:text-base">{formatPrice(selectedPost.price)}</p>
                        </div>
                        <div>
                           <p className="text-[10px] sm:text-xs text-slate-500">Tiền cọc</p>
                           <p className="font-bold text-slate-700 text-xs sm:text-base">{formatPrice(selectedPost.deposit)}</p>
                        </div>
                        <div>
                           <p className="text-[10px] sm:text-xs text-slate-500">Diện tích</p>
                           <p className="font-bold text-slate-700 text-xs sm:text-base">{selectedPost.area} m²</p>
                        </div>
                     </div>

                     <div className="border-t border-slate-100 pt-4">
                        <h4 className="font-bold text-slate-900 mb-2">Thông tin liên hệ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                           <p><span className="text-slate-400">Người đăng:</span> <span className="font-semibold text-slate-800">{selectedPost.user?.fullName}</span></p>
                           <p><span className="text-slate-400">Số điện thoại:</span> <span className="font-semibold text-slate-800">{selectedPost.contactPhone}</span></p>
                        </div>
                     </div>

                     {selectedPost.amenities?.length > 0 && (
                        <div className="border-t border-slate-100 pt-4">
                           <h4 className="font-bold text-slate-900 mb-2">Tiện nghi</h4>
                           <div className="flex flex-wrap gap-1.5">
                              {selectedPost.amenities.map((item) => (
                                 <span key={item.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    {item.name}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     <div className="border-t border-slate-100 pt-4">
                        <h4 className="font-bold text-slate-900 mb-2">Mô tả</h4>
                        {selectedPost.description ? (
                           <div
                              className="prose prose-xs sm:prose-sm max-w-none text-slate-600 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto"
                              dangerouslySetInnerHTML={{ __html: selectedPost.description }}
                           />
                        ) : (
                           <p className="text-slate-400 italic">Không có mô tả.</p>
                        )}
                     </div>
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
                     <button
                        onClick={() => setSelectedPost(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs"
                     >
                        Đóng
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* --- Delete Confirmation Modal --- */}
         {deleteId && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl w-full max-w-sm text-center space-y-3">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                     <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bài đăng</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                     Bạn có chắc chắn muốn xóa bài đăng này? Hành động này sẽ thực hiện xóa mềm bài đăng khỏi hệ thống.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                     <button
                        onClick={() => setDeleteId(null)}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                     >
                        Hủy bỏ
                     </button>
                     <button
                        onClick={handleDelete}
                        className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition shadow-xs"
                     >
                        Xác nhận xóa
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}