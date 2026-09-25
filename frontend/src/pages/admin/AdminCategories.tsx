/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
   Search,
   Plus,
   Edit3,
   Trash2,
   RefreshCw,
   Tag,
   X,
   ChevronLeft,
   ChevronRight,
   AlertCircle,
} from 'lucide-react';
import type { Category } from '../../types/post/category';
import { categoryApi, type CreateCategoryInput, type UpdateCategoryInput } from '../../api/category.api';
import { notify } from '../../utils/notify.utils';

// Helper chuyển Tiếng Việt có dấu thành Slug chuẩn
function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
}

export default function AdminCategories(): React.ReactElement {
   // Data States
   const [categories, setCategories] = useState<Category[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   // Modal Thêm/Sửa States
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [editingCategory, setEditingCategory] = useState<Category | null>(null);

   // Modal Xóa States
   const [deleteId, setDeleteId] = useState<string | null>(null);
   const [deleting, setDeleting] = useState<boolean>(false);

   // Form States & Validation Errors
   const [name, setName] = useState<string>('');
   const [slug, setSlug] = useState<string>('');
   const [isAutoSlug, setIsAutoSlug] = useState<boolean>(true);
   const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string }>({});
   const [submitting, setSubmitting] = useState<boolean>(false);

   // Search & Pagination States
   const [searchTerm, setSearchTerm] = useState<string>('');
   const [page, setPage] = useState<number>(1);
   const [limit] = useState<number>(10);

   // 1. Hàm gọi API lấy danh sách danh mục
   const fetchCategories = useCallback(async function () {
      setLoading(true);
      try {
         const data = await categoryApi.getAll();
         setCategories(data || []);
      } catch (error: any) {
         notify.error('Lỗi khi tải danh sách danh mục: ', error);
      } finally {
         setLoading(false);
      }
   }, []);

   // 2. Load dữ liệu khi component mount
   useEffect(() => {
      fetchCategories();
   }, [fetchCategories]);

   // Reset Form input
   function resetForm() {
      setName('');
      setSlug('');
      setIsAutoSlug(true);
      setFormErrors({});
      setEditingCategory(null);
   }

   // Reset Search & Pagination
   function reset() {
      setSearchTerm('');
      setPage(1);
      fetchCategories();
   }

   // Mở modal Thêm mới
   function handleOpenCreateModal() {
      resetForm();
      setIsModalOpen(true);
   }

   // Mở modal Cập nhật
   function handleOpenEditModal(category: Category) {
      resetForm();
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setIsAutoSlug(false);
      setIsModalOpen(true);
   }

   // Đóng modal Thêm/Sửa
   function handleCloseModal() {
      setIsModalOpen(false);
      resetForm();
   }

   // Thay đổi Input Tên
   function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = e.target.value;
      setName(val);
      if (isAutoSlug) {
         setSlug(generateSlug(val));
      }
      if (formErrors.name) {
         setFormErrors((prev) => ({ ...prev, name: undefined }));
      }
   }

   // Thay đổi Input Slug
   function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
      setSlug(e.target.value);
      setIsAutoSlug(false);
      if (formErrors.slug) {
         setFormErrors((prev) => ({ ...prev, slug: undefined }));
      }
   }

   // Validate Client
   function validateForm(): boolean {
      const errors: { name?: string; slug?: string } = {};
      const trimmedName = name.trim();
      const trimmedSlug = slug.trim().toLowerCase();

      if (!trimmedName) {
         errors.name = 'Tên danh mục không được để trống';
      }

      if (!trimmedSlug) {
         errors.slug = 'Slug không được để trống';
      }

      if (trimmedName) {
         const isDuplicateName = categories.some((cat) => {
            if (editingCategory && cat.id === editingCategory.id) return false;
            return cat.name.trim().toLowerCase() === trimmedName.toLowerCase();
         });

         if (isDuplicateName) {
            errors.name = 'Tên danh mục đã tồn tại trong hệ thống';
         }
      }

      if (trimmedSlug) {
         const isDuplicateSlug = categories.some((cat) => {
            if (editingCategory && cat.id === editingCategory.id) return false;
            return cat.slug.trim().toLowerCase() === trimmedSlug;
         });

         if (isDuplicateSlug) {
            errors.slug = 'Tên slug đã tồn tại trong hệ thống';
         }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   }

   // Submit Form (Create / Update)
   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (!validateForm()) return;

      setSubmitting(true);
      const formattedName = name.trim();
      const formattedSlug = slug.trim().toLowerCase();

      try {
         if (editingCategory) {
            const updateData: UpdateCategoryInput = {
               name: formattedName,
               slug: formattedSlug,
            };
            await categoryApi.update(editingCategory.id, updateData);
            notify.success('Cập nhật danh mục thành công!');
         } else {
            const createData: CreateCategoryInput = {
               name: formattedName,
               slug: formattedSlug,
            };
            await categoryApi.create(createData);
            notify.success('Tạo danh mục mới thành công!');
         }

         handleCloseModal();
         fetchCategories();
      } catch (error: any) {
         notify.error(editingCategory ? 'Lỗi khi cập nhật danh mục: ' : 'Lỗi khi tạo danh mục: ', error);
      } finally {
         setSubmitting(false);
      }
   }

   // Xóa danh mục
   async function handleDelete() {
      if (!deleteId) return;

      setDeleting(true);
      try {
         await categoryApi.delete(deleteId);
         setDeleteId(null);
         notify.success('Xóa danh mục thành công');
         fetchCategories();
      } catch (error: any) {
         notify.error('Lỗi khi xóa danh mục: ', error);
      } finally {
         setDeleting(false);
      }
   }

   // Lọc danh mục theo Search Term
   const filteredCategories = useMemo(() => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return categories;
      return categories.filter(
         (category) =>
            category.name.toLowerCase().includes(term) ||
            category.slug.toLowerCase().includes(term)
      );
   }, [categories, searchTerm]);

   // Phân trang
   const total = filteredCategories.length;
   const totalPages = Math.ceil(total / limit) || 1;
   const paginatedCategories = useMemo(() => {
      const startIndex = (page - 1) * limit;
      return filteredCategories.slice(startIndex, startIndex + limit);
   }, [filteredCategories, page, limit]);

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Page Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Quản lý danh mục
               </h1>
               <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Quản lý các loại danh mục bài đăng phòng trọ trên hệ thống
               </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
               <button
                  onClick={reset}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition shadow-xs font-semibold text-xs sm:text-sm disabled:opacity-50 active:scale-95"
               >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                  <span>Làm mới</span>
               </button>
               <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs font-semibold text-xs sm:text-sm active:scale-95"
               >
                  <Plus className="w-4 h-4" />
                  <span>Thêm danh mục</span>
               </button>
            </div>
         </div>

         {/* Filter & Search Bar */}
         <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="relative w-full md:w-80 lg:w-96">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Tìm kiếm danh mục, slug..."
                  value={searchTerm}
                  onChange={(e) => {
                     setSearchTerm(e.target.value);
                     setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
               />
            </div>
         </div>

         {/* Data Area */}
         <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            
            {/* 1. Mobile & Tablet Card View (< 768px) */}
            <div className="block md:hidden divide-y divide-slate-100">
               {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">Đang tải dữ liệu...</div>
               ) : paginatedCategories.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">Không tìm thấy danh mục nào.</div>
               ) : (
                  paginatedCategories.map((category, index) => (
                     <div key={category.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 w-5">
                                 #{(page - 1) * limit + index + 1}
                              </span>
                              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm truncate">
                                 <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                 <span className="truncate">{category.name}</span>
                              </div>
                           </div>
                           <div className="pl-7">
                              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md inline-block truncate max-w-[200px]">
                                 {category.slug}
                              </span>
                           </div>
                        </div>

                        {/* Thao tác */}
                        <div className="flex items-center gap-1.5 shrink-0">
                           <button
                              type="button"
                              onClick={() => handleOpenEditModal(category)}
                              className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition"
                           >
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button
                              type="button"
                              onClick={() => setDeleteId(category.id)}
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
                        <th className="py-3.5 px-4">Tên danh mục</th>
                        <th className="py-3.5 px-4">Slug</th>
                        <th className="py-3.5 px-4 text-center">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Đang tải dữ liệu...
                           </td>
                        </tr>
                     ) : paginatedCategories.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="text-center py-12 text-slate-400">
                              Không tìm thấy danh mục nào.
                           </td>
                        </tr>
                     ) : (
                        paginatedCategories.map((category, index) => (
                           <tr key={category.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                                 {(page - 1) * limit + index + 1}
                              </td>

                              <td className="py-4 px-4 font-bold text-slate-900">
                                 <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>{category.name}</span>
                                 </div>
                              </td>

                              <td className="py-4 px-4">
                                 <span className="font-mono text-xs text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md inline-block">
                                    {category.slug}
                                 </span>
                              </td>

                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                 <div className="flex items-center justify-center gap-1.5">
                                    <button
                                       type="button"
                                       onClick={() => handleOpenEditModal(category)}
                                       className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-xl transition"
                                       title="Chỉnh sửa danh mục"
                                    >
                                       <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => setDeleteId(category.id)}
                                       className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition"
                                       title="Xóa danh mục"
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
                  Hiển thị <span className="font-bold text-slate-700">{paginatedCategories.length}</span> / <span className="font-bold text-slate-700">{total}</span> danh mục
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
                     <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                     </h2>
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
                           Tên danh mục <span className="text-rose-500">*</span>
                        </label>
                        <input
                           type="text"
                           value={name}
                           onChange={handleNameChange}
                           placeholder="Nhập tên danh mục..."
                           className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition ${
                              formErrors.name
                                 ? 'border-rose-500 focus:ring-rose-200'
                                 : 'border-slate-200 focus:ring-blue-500'
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
                              Slug <span className="text-rose-500">*</span>
                           </label>
                           {!editingCategory && (
                              <label className="text-xs text-blue-600 flex items-center gap-1 cursor-pointer font-bold">
                                 <input
                                    type="checkbox"
                                    checked={isAutoSlug}
                                    onChange={(e) => {
                                       setIsAutoSlug(e.target.checked);
                                       if (e.target.checked) setSlug(generateSlug(name));
                                    }}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                 />
                                 Tự động tạo
                              </label>
                           )}
                        </div>
                        <input
                           type="text"
                           value={slug}
                           onChange={handleSlugChange}
                           placeholder="danh-muc-vi-du"
                           className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                              formErrors.slug
                                 ? 'border-rose-500 focus:ring-rose-200'
                                 : 'border-slate-200 focus:ring-blue-500'
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
                           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition text-xs shadow-xs"
                        >
                           {submitting ? 'Đang xử lý...' : editingCategory ? 'Lưu thay đổi' : 'Tạo mới'}
                        </button>
                     </div>
                  </form>
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
                  <h3 className="text-base font-bold text-slate-900">Xác nhận xóa danh mục</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                     Bạn có chắc chắn muốn xóa danh mục này? Hành động này sẽ xóa danh mục vĩnh viễn khỏi hệ thống.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                     <button
                        onClick={() => setDeleteId(null)}
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