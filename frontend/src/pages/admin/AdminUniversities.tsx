/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
   Search,
   Plus,
   RefreshCw,
   Edit2,
   Trash2,
   ChevronLeft,
   ChevronRight,
   GraduationCap,
   Building2,
   X,
   Check,
   AlertCircle,
} from 'lucide-react';
import type { University } from '../../types/post/university';
import { notify } from '../../utils/notify.utils';
import {
   universityApi,
   type QueryUniversity,
   type CreateUniversityPayload,
   type UpdateUniversityPayload,
} from '../../api/university.api';

// Helper tự động tạo Slug chuẩn từ Tiếng Việt
function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
}

export default function AdminUniversities(): React.ReactElement {
   // Data States
   const [universities, setUniversities] = useState<University[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [total, setTotal] = useState<number>(0);
   const [totalPages, setTotalPages] = useState<number>(1);

   // Query & Filter States
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [debouncedSearch, setDebouncedSearch] = useState<string>('');
   const [page, setPage] = useState<number>(1);
   const [limit, setLimit] = useState<number>(10);

   // Modal & Form States
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
   const [formData, setFormData] = useState<{ name: string; slug: string }>({
      name: '',
      slug: '',
   });
   const [autoSlug, setAutoSlug] = useState<boolean>(true);
   const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string }>({});
   const [submitting, setSubmitting] = useState<boolean>(false);

   // Modal Confirm Delete State
   const [deletingId, setDeletingId] = useState<string | null>(null);
   const [deleting, setDeleting] = useState<boolean>(false);

   // 1. Debounce Search Input (Tránh gọi API liên tục khi gõ)
   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(searchTerm);
      }, 300);

      return () => clearTimeout(timer);
   }, [searchTerm]);

   // Reset về trang 1 khi từ khóa tìm kiếm thay đổi
   useEffect(() => {
      setPage(1);
   }, [debouncedSearch]);

   // 2. Fetch Danh sách Trường đại học từ API
   const fetchUniversities = useCallback(
      async (overrideParams?: QueryUniversity) => {
         setLoading(true);
         try {
            const params: QueryUniversity = {
               keyword: overrideParams?.keyword !== undefined ? overrideParams.keyword : (debouncedSearch || undefined),
               page: overrideParams?.page ?? page,
               limit: overrideParams?.limit ?? limit,
            };
            const response = await universityApi.getAll(params);
            setUniversities(response.data || []);
            setTotal(response.total || 0);
            setTotalPages(response.totalPages || 1);
         } catch (error: any) {
            notify.error('Lỗi khi tải danh sách trường đại học: ', error);
         } finally {
            setLoading(false);
         }
      },
      [debouncedSearch, page, limit]
   );

   // Tải lại dữ liệu khi page, limit, hoặc debouncedSearch thay đổi
   useEffect(() => {
      fetchUniversities();
   }, [fetchUniversities]);

   // Làm mới dữ liệu
   function handleRefresh() {
      setSearchTerm('');
      setPage(1);
      setLimit(10);
      fetchUniversities({ keyword: undefined, page: 1, limit: 10 });
   }

   // Reset Form
   function resetForm() {
      setFormData({ name: '', slug: '' });
      setAutoSlug(true);
      setFormErrors({});
      setEditingUniversity(null);
   }

   // Handlers mở / đóng Modal Form
   function handleOpenCreateModal() {
      resetForm();
      setIsModalOpen(true);
   }

   function handleOpenEditModal(uni: University) {
      resetForm();
      setEditingUniversity(uni);
      setFormData({ name: uni.name, slug: uni.slug });
      setAutoSlug(false);
      setIsModalOpen(true);
   }

   function handleCloseModal() {
      setIsModalOpen(false);
      resetForm();
   }

   // Handlers nhập dữ liệu
   function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      const nameVal = e.target.value;
      setFormData((prev) => ({
         ...prev,
         name: nameVal,
         slug: autoSlug ? generateSlug(nameVal) : prev.slug,
      }));
      if (formErrors.name) {
         setFormErrors((prev) => ({ ...prev, name: undefined }));
      }
   }

   function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
      const slugVal = e.target.value;
      setAutoSlug(false);
      setFormData((prev) => ({ ...prev, slug: slugVal }));
      if (formErrors.slug) {
         setFormErrors((prev) => ({ ...prev, slug: undefined }));
      }
   }

   // Validate Form Client
   function validateForm(): boolean {
      const errors: { name?: string; slug?: string } = {};
      const trimmedName = formData.name.trim();
      const trimmedSlug = formData.slug.trim().toLowerCase();

      if (!trimmedName) {
         errors.name = 'Tên trường đại học không được để trống';
      }

      if (!trimmedSlug) {
         errors.slug = 'Slug đường dẫn không được để trống';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   }

   // 3. Submit Tạo mới hoặc Cập nhật
   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!validateForm()) return;

      setSubmitting(true);
      const namePayload = formData.name.trim();
      const slugPayload = formData.slug.trim().toLowerCase();

      try {
         if (editingUniversity) {
            const payload: UpdateUniversityPayload = {
               name: namePayload,
               slug: slugPayload,
            };
            await universityApi.update(editingUniversity.id, payload);
            notify.success('Cập nhật trường đại học thành công!');
         } else {
            const payload: CreateUniversityPayload = {
               name: namePayload,
               slug: slugPayload,
            };
            await universityApi.create(payload);
            notify.success('Thêm trường đại học mới thành công!');
         }
         handleCloseModal();
         fetchUniversities();
      } catch (error: any) {
         notify.error('Thao tác thất bại: ', error);
      } finally {
         setSubmitting(false);
      }
   }

   // 4. Xóa trường đại học
   async function handleDelete() {
      if (!deletingId) return;

      setDeleting(true);
      try {
         await universityApi.delete(deletingId);
         notify.success('Xóa trường đại học thành công!');
         setDeletingId(null);
         fetchUniversities();
      } catch (error: any) {
         notify.error('Lỗi khi xóa trường đại học: ', error);
      } finally {
         setDeleting(false);
      }
   }

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Quản lý Trường đại học
               </h1>
               <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Danh sách và thông tin các trường đại học/cao đẳng dùng để lọc bài đăng
               </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
               <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs font-semibold text-xs sm:text-sm disabled:opacity-50 active:scale-95"
               >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>Làm mới</span>
               </button>
               <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs font-semibold text-xs sm:text-sm active:scale-95"
               >
                  <Plus className="w-4 h-4" />
                  <span>Thêm trường mới</span>
               </button>
            </div>
         </div>

         {/* Search Bar & Filters */}
         <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
               <div className="relative w-full md:w-80 lg:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Tìm kiếm trường đại học, slug..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
               </div>

               <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto">
                  <span>Hiển thị:</span>
                  <select
                     value={limit}
                     onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                     }}
                     className="border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold"
                  >
                     <option value={10}>10 mục</option>
                     <option value={15}>15 mục</option>
                     <option value={20}>20 mục</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Data Container */}
         <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            
            {/* 1. Mobile & Tablet Card View (< 768px) */}
            <div className="block md:hidden divide-y divide-slate-100">
               {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">Đang tải dữ liệu...</div>
               ) : universities.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">Không tìm thấy trường đại học nào.</div>
               ) : (
                  universities.map((uni, index) => (
                     <div key={uni.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 w-5">
                                 #{(page - 1) * limit + index + 1}
                              </span>
                              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm truncate">
                                 <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-4 h-4" />
                                 </div>
                                 <span className="truncate">{uni.name}</span>
                              </div>
                           </div>
                           <div className="pl-7">
                              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md inline-block truncate max-w-[200px]">
                                 {uni.slug}
                              </span>
                           </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                           <button
                              type="button"
                              onClick={() => handleOpenEditModal(uni)}
                              className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition"
                           >
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button
                              type="button"
                              onClick={() => setDeletingId(uni.id)}
                              className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* 2. Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left text-sm border-collapse">
                  <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-4 w-16 text-center">STT</th>
                        <th className="py-3.5 px-4">Tên Trường</th>
                        <th className="py-3.5 px-4">Slug / Đường dẫn</th>
                        <th className="py-3.5 px-4 text-center w-32">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Đang tải dữ liệu...
                           </td>
                        </tr>
                     ) : universities.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Không tìm thấy trường đại học nào.
                           </td>
                        </tr>
                     ) : (
                        universities.map((uni, index) => (
                           <tr key={uni.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                                 {(page - 1) * limit + index + 1}
                              </td>

                              <td className="py-4 px-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                       <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-900">
                                       {uni.name}
                                    </span>
                                 </div>
                              </td>

                              <td className="py-4 px-4">
                                 <span className="font-mono text-xs text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md inline-block">
                                    {uni.slug}
                                 </span>
                              </td>

                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                 <div className="flex items-center justify-center gap-1.5">
                                    <button
                                       type="button"
                                       onClick={() => handleOpenEditModal(uni)}
                                       className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-xl transition"
                                       title="Chỉnh sửa trường"
                                    >
                                       <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => setDeletingId(uni.id)}
                                       className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition"
                                       title="Xóa trường"
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
                  Hiển thị <span className="font-bold text-slate-700">{universities.length}</span> / <span className="font-bold text-slate-700">{total}</span> trường đại học
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

         {/* --- Create / Edit Modal --- */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                     <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                           {editingUniversity ? 'Chỉnh sửa Trường đại học' : 'Thêm Trường đại học mới'}
                        </h2>
                     </div>
                     <button
                        onClick={handleCloseModal}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
                     <div>
                        <label className="block font-bold text-slate-700 mb-1">
                           Tên Trường Đại Học <span className="text-rose-500">*</span>
                        </label>
                        <input
                           type="text"
                           placeholder="VD: Đại học Quốc gia TP.HCM"
                           value={formData.name}
                           onChange={handleNameChange}
                           className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition ${
                              formErrors.name
                                 ? 'border-rose-500 focus:ring-rose-200'
                                 : 'border-slate-200 focus:ring-indigo-500'
                           }`}
                        />
                        {formErrors.name && (
                           <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {formErrors.name}
                           </p>
                        )}
                     </div>

                     <div>
                        <div className="flex justify-between items-center mb-1">
                           <label className="block font-bold text-slate-700">
                              Slug / Đường dẫn <span className="text-rose-500">*</span>
                           </label>
                           {!editingUniversity && (
                              <label className="text-xs text-indigo-600 flex items-center gap-1 cursor-pointer font-bold">
                                 <input
                                    type="checkbox"
                                    checked={autoSlug}
                                    onChange={(e) => {
                                       setAutoSlug(e.target.checked);
                                       if (e.target.checked) {
                                          setFormData((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
                                       }
                                    }}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                 />
                                 Tự động tạo
                              </label>
                           )}
                        </div>
                        <input
                           type="text"
                           placeholder="VD: dai-hoc-quoc-gia-tphcm"
                           value={formData.slug}
                           onChange={handleSlugChange}
                           className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                              formErrors.slug
                                 ? 'border-rose-500 focus:ring-rose-200'
                                 : 'border-slate-200 focus:ring-indigo-500'
                           }`}
                        />
                        {formErrors.slug && (
                           <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {formErrors.slug}
                           </p>
                        )}
                     </div>

                     <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                           type="button"
                           onClick={handleCloseModal}
                           className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition text-xs"
                        >
                           Hủy bỏ
                        </button>
                        <button
                           type="submit"
                           disabled={submitting}
                           className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition text-xs shadow-xs"
                        >
                           {submitting ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                           ) : (
                              <Check className="w-4 h-4" />
                           )}
                           <span>{editingUniversity ? 'Lưu thay đổi' : 'Tạo mới'}</span>
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* --- Delete Confirmation Modal --- */}
         {deletingId && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl w-full max-w-sm text-center space-y-3">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                     <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Xác nhận xóa trường đại học?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                     Hành động này sẽ xóa vĩnh viễn trường đại học khỏi hệ thống và không thể hoàn tác.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                     <button
                        onClick={() => setDeletingId(null)}
                        disabled={deleting}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                     >
                        Hủy bỏ
                     </button>
                     <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 disabled:opacity-50 transition shadow-xs"
                     >
                        {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}