import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
   Sparkles,
   Eye,
   Edit3,
   Send,
   MapPin,
   DollarSign,
   Building2,
   Phone,
   ArrowLeft,
   ShieldAlert,
   Search,
   ChevronDown,
   X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostForm } from '../../hooks/usePostForm';
import PostPreview from '../../components/posts/PostPreview';
import AmenitiesSection from '../../components/posts/AmenitiesSection';
import UniversitiesSection from '../../components/posts/UniversitiesSection';
import MediaUploadSection from '../../components/posts/MediaUploadSection';

export default function CreatePostPage(): React.ReactElement {
   const navigate = useNavigate();
   const {
      activeTab,
      setActiveTab,
      categories,
      amenities,
      universities,
      isLoading,
      isSubmitting,
      errors,
      formData,
      selectedAmenityId,
      setSelectedAmenityId,
      selectedUniId,
      setSelectedUniId,
      uniDistance,
      setUniDistance,
      handleInputChange,
      handleAddAmenity,
      handleRemoveAmenity,
      handleFileChange,
      handleRemoveMedia,
      handleAddUniversity,
      handleRemoveUniversity,
      handleSubmit,
   } = usePostForm();

   // State & Ref quản lý Dropdown Custom cho Danh mục
   const [isCatOpen, setIsCatOpen] = useState(false);
   const [catSearchTerm, setCatSearchTerm] = useState('');
   const catDropdownRef = useRef<HTMLDivElement>(null);

   const selectedCategory = categories.find((c) => c.id === formData.categoryId);
   const filteredCategories = categories.filter((c) =>
      c.name.toLowerCase().includes(catSearchTerm.toLowerCase())
   );

   // Tự động đóng dropdown khi click bên ngoài
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
            setIsCatOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Cảnh báo rời trang/Reload khi người dùng đã nhập dữ liệu
   useEffect(() => {
      const hasContent = Boolean(
         formData.title || formData.streetAddress || formData.price || formData.medias.length > 0
      );

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         if (hasContent && !isSubmitting) {
            e.preventDefault();
            e.returnValue = '';
         }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
   }, [formData, isSubmitting]);

   // Hàm helper trigger onChange mặc định
   const triggerCategoryChange = (val: string) => {
      const syntheticEvent = {
         target: { name: 'categoryId', value: val },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleInputChange(syntheticEvent);
   };

   function handleSelectCategory(catId: string) {
      triggerCategoryChange(catId);
      setIsCatOpen(false);
      setCatSearchTerm('');
   }

   function handleClearCategory(e: React.MouseEvent) {
      e.stopPropagation();
      triggerCategoryChange('');
      setCatSearchTerm('');
   }

   function preventInvalidNumberKeys(e: React.KeyboardEvent<HTMLInputElement>): void {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
         e.preventDefault();
      }
   }

   if (isLoading) {
      return (
         <div className="min-h-[70vh] flex items-center justify-center">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
               <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
               <span className="text-sm font-medium text-slate-600">Đang tải cấu hình hệ thống...</span>
            </div>
         </div>
      );
   }

   return (
      <>
         {/* Tối ưu Meta Tags / SEO Nội bộ */}
         <Helmet>
            <title>Đăng Tin Cho Thuê Phòng Trọ, Căn Hộ | SGHOUSES</title>
            <meta name="robots" content="noindex, nofollow" />
         </Helmet>

         <div className="min-h-screen bg-slate-50/60 pb-16 pt-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

               {/* Thanh điều hướng quay lại & Header */}
               <div className="flex items-center justify-between">
                  <button
                     type="button"
                     onClick={() => navigate(-1)}
                     className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" /> Quay lại
                  </button>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                     <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Hệ thống bảo mật tin đăng
                  </span>
               </div>

               {/* Header chuyển Tab (Edit / Preview) */}
               <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                     <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Đăng tin phòng trọ - căn hộ
                     </h1>
                     <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Cung cấp đầy đủ thông tin để bài đăng được ưu tiên xuất bản nhanh chóng.
                     </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl self-start sm:self-auto shrink-0 border border-slate-200/50">
                     <button
                        type="button"
                        onClick={() => setActiveTab('edit')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                           }`}
                     >
                        <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                     </button>
                     <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                           }`}
                     >
                        <Eye className="w-3.5 h-3.5" /> Xem trước
                     </button>
                  </div>
               </div>

               {/* Nội dung chính */}
               {activeTab === 'preview' ? (
                  <PostPreview
                     formData={formData}
                     categories={categories}
                     amenities={amenities}
                     universities={universities}
                     onBackToEdit={() => setActiveTab('edit')}
                  />
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* 1. Cấu hình cơ bản */}
                     <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wide">
                           <Building2 className="w-4 h-4 text-blue-600" /> Thông tin tổng quan
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {/* Custom Dropdown / Searchable Select cho Loại Phòng */}
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                 Loại phòng <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative" ref={catDropdownRef}>
                                 <button
                                    type="button"
                                    onClick={() => setIsCatOpen(!isCatOpen)}
                                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center justify-between text-left transition-all ${errors.categoryId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
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
                                       <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                 </button>

                                 {/* Dropdown Menu */}
                                 {isCatOpen && (
                                    <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
                                       <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                                          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                                          <input
                                             type="text"
                                             value={catSearchTerm}
                                             onChange={(e) => setCatSearchTerm(e.target.value)}
                                             placeholder="Tìm danh mục..."
                                             className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400 pr-2"
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
                                             filteredCategories.map((c) => (
                                                <button
                                                   key={c.id}
                                                   type="button"
                                                   onClick={() => handleSelectCategory(c.id)}
                                                   className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${formData.categoryId === c.id
                                                         ? 'bg-blue-50 text-blue-600 font-semibold'
                                                         : 'hover:bg-slate-50 text-slate-700'
                                                      }`}
                                                >
                                                   <span className="truncate">{c.name}</span>
                                                </button>
                                             ))
                                          ) : (
                                             <div className="p-3 text-xs text-center text-slate-400">Không tìm thấy danh mục phù hợp</div>
                                          )}
                                       </div>
                                    </div>
                                 )}
                              </div>
                              {errors.categoryId && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.categoryId}</p>}
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                 Số điện thoại liên hệ <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                 <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                 <input
                                    type="text"
                                    name="contactPhone"
                                    placeholder="VD: 0901234567"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.contactPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                       }`}
                                 />
                              </div>
                              {errors.contactPhone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.contactPhone}</p>}
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Tiêu đề bài đăng <span className="text-rose-500">*</span>
                           </label>
                           <input
                              type="text"
                              name="title"
                              placeholder="VD: Cho thuê phòng trọ khép kín full nội thất gần ĐH Bách Khoa"
                              value={formData.title}
                              onChange={handleInputChange}
                              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                 }`}
                           />
                           {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Địa chỉ cụ thể <span className="text-rose-500">*</span>
                           </label>
                           <div className="relative">
                              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                 type="text"
                                 name="streetAddress"
                                 placeholder="VD: Số 123 Đường Lý Thường Kiệt, Phường 14"
                                 value={formData.streetAddress}
                                 onChange={handleInputChange}
                                 className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.streetAddress ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                    }`}
                              />
                           </div>
                           {errors.streetAddress && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.streetAddress}</p>}
                        </div>
                     </div>

                     {/* 2. Giá cả & Chi tiết diện tích */}
                     <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wide">
                           <DollarSign className="w-4 h-4 text-emerald-600" /> Chi phí & Diện tích
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                 Giá cho thuê (đ/tháng) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                 type="number"
                                 name="price"
                                 min="0"
                                 onKeyDown={preventInvalidNumberKeys}
                                 placeholder="VD: 3500000"
                                 value={formData.price}
                                 onChange={handleInputChange}
                                 className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.price ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                    }`}
                              />
                              {errors.price && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price}</p>}
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                 Diện tích (m²) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                 type="number"
                                 name="area"
                                 min="0"
                                 onKeyDown={preventInvalidNumberKeys}
                                 placeholder="VD: 25"
                                 value={formData.area}
                                 onChange={handleInputChange}
                                 className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.area ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                    }`}
                              />
                              {errors.area && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.area}</p>}
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tiền đặt cọc (đ)</label>
                              <input
                                 type="number"
                                 name="deposit"
                                 placeholder="VD: 3500000"
                                 onKeyDown={preventInvalidNumberKeys}
                                 value={formData.deposit}
                                 min="0"
                                 onChange={handleInputChange}
                                 className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">Mô tả chi tiết</label>
                           <textarea
                              name="description"
                              rows={4}
                              placeholder="Mô tả cụ thể về giờ giấc, tiện ích xung quanh, chi phí phát sinh (điện, nước, internet)..."
                              value={formData.description}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                           />
                        </div>
                     </div>

                     {/* 3. Tải lên hình ảnh / video */}
                     <MediaUploadSection
                        medias={formData.medias}
                        onFileChange={handleFileChange}
                        onRemoveMedia={handleRemoveMedia}
                     />

                     {/* 4. Tiện ích bài đăng */}
                     <AmenitiesSection
                        amenities={amenities}
                        selectedAmenityId={selectedAmenityId}
                        setSelectedAmenityId={setSelectedAmenityId}
                        selectedAmenityIds={formData.amenityIds}
                        onAdd={handleAddAmenity}
                        onRemove={handleRemoveAmenity}
                     />

                     {/* 5. Trường Đại Học gần đây */}
                     <UniversitiesSection
                        universities={universities}
                        selectedUniId={selectedUniId}
                        setSelectedUniId={setSelectedUniId}
                        uniDistance={uniDistance}
                        setUniDistance={setUniDistance}
                        addedUniversities={formData.universities}
                        onAdd={handleAddUniversity}
                        onRemove={handleRemoveUniversity}
                     />

                     {/* Thanh Nút hành động Submit */}
                     <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                           type="button"
                           onClick={() => setActiveTab('preview')}
                           className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
                        >
                           <Sparkles className="w-4 h-4 text-amber-500" /> Xem trước tin đăng
                        </button>

                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
                        >
                           <Send className="w-4 h-4" />
                           {isSubmitting ? 'Đang tạo tin đăng...' : 'Đăng tin ngay'}
                        </button>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </>
   );
}