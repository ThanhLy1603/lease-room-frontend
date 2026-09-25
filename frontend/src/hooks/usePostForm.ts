import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import type { Category } from "../types/post/category";
import type { Amenity } from "../types/post/amenity";
import type { University } from "../types/post/university";
import type { CreatePost } from "../types/post/create-post";
import { categoryApi } from "../api/category.api";
import { amenityApi } from "../api/amenity.api";
import { universityApi } from "../api/university.api";
import { postApi } from "../api/post.api";
import { notify } from "../utils/notify.utils";
import type {
   AmenityResponse,
   PostMediaResponse,
   UniversityNearResponse,
} from "../types/post/post-response";
import type { UpdatePost } from "../types/post/update-post";

export interface Media {
   id?: string;
   file?: File;
   mediaUrl: string;
   mediaType: "IMAGE" | "VIDEO";
}

export interface UniversityNear {
   universityId: string;
   distanceKm?: number;
}

export interface PostFormData {
   categoryId: string;
   title: string;
   description: string;
   price: string | number;
   area: string | number;
   deposit: string | number;
   provinceId: number;
   districtId: number;
   wardId: number;
   streetAddress: string;
   contactPhone: string;
   amenityIds: string[];
   medias: Media[];
   universities: UniversityNear[];
}

export function usePostForm(editPostId?: string) {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

   // State dữ liệu master
   const [categories, setCategories] = useState<Category[]>([]);
   const [amenities, setAmenities] = useState<Amenity[]>([]);
   const [universities, setUniversities] = useState<University[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

   // Validation & State tạm
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [selectedAmenityId, setSelectedAmenityId] = useState<string>("");
   const [selectedUniId, setSelectedUniId] = useState<string>("");
   const [uniDistance, setUniDistance] = useState<number | "">("");

   const [formData, setFormData] = useState<PostFormData>({
      categoryId: "",
      title: "",
      description: "",
      price: "",
      area: "",
      deposit: "",
      provinceId: 79,
      districtId: 760,
      wardId: 26740,
      streetAddress: "",
      contactPhone: "",
      amenityIds: [],
      medias: [],
      universities: [],
   });

   useEffect(() => {
      async function getData() {
         try {
            setIsLoading(true);
            const [categoriesResponse, amenitiesResponse, universitiesResponse] =
               await Promise.all([
                  categoryApi.getAll().catch(() => null),
                  amenityApi.getAll().catch(() => null),
                  universityApi.getAll().catch(() => null),
               ]);

            setCategories(categoriesResponse || []);
            setAmenities(amenitiesResponse || []);
            setUniversities(universitiesResponse?.data || []);

            // NẾU LÀ MODE EDIT: Fetch dữ liệu bài đăng cũ và fill vào formData
            if (editPostId) {
               const existingPost = await postApi.getById(editPostId);
               if (existingPost) {
                  setFormData({
                     categoryId: existingPost.category?.id || "",
                     title: existingPost.title || "",
                     description: existingPost.description || "",
                     price: existingPost.price ?? "",
                     area: existingPost.area ?? "",
                     deposit: existingPost.deposit ?? "",
                     provinceId: existingPost.provinceId || 79,
                     districtId: existingPost.districtId || 760,
                     wardId: existingPost.wardId || 26740,
                     streetAddress: existingPost.streetAddress || "",
                     contactPhone: existingPost.contactPhone || "",
                     amenityIds:
                        existingPost.amenities?.map((a: AmenityResponse) => a.id) || [],
                     medias:
                        existingPost.medias?.map((m: PostMediaResponse) => ({
                           id: m.id,
                           mediaUrl: m.mediaUrl,
                           mediaType: m.mediaType,
                        })) || [],
                     universities:
                        existingPost.universityNears?.map(
                           (u: UniversityNearResponse) => ({
                              universityId: u.id,
                              distanceKm: u.distanceKm ?? 0,
                           }),
                        ) || [],
                  });
               }
            } else if (categoriesResponse && categoriesResponse.length > 0) {
               // MẶC ĐỊNH CHO MODE CREATE
               setFormData((prev) => ({
                  ...prev,
                  categoryId: categoriesResponse[0].id,
               }));
            }
         } catch {
            notify.error("Lỗi khi tải dữ liệu khởi tạo");
         } finally {
            setIsLoading(false);
         }
      }
      void getData();
   }, [editPostId]);

   function handleInputChange(
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
   ) {
      const { name, value } = e.target;
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

      setFormData((prev) => ({
         ...prev,
         [name]: [
            "price",
            "area",
            "deposit",
            "provinceId",
            "districtId",
            "wardId",
         ].includes(name)
            ? value
               ? Number(value)
               : ""
            : value,
      }));
   }

   function handleAddAmenity(): void {
      if (!selectedAmenityId)
         return notify.error("Vui lòng chọn tiện ích trước khi thêm");
      if (formData.amenityIds.includes(selectedAmenityId))
         return notify.error("Tiện ích này đã được thêm vào danh sách");

      setFormData((prev) => ({
         ...prev,
         amenityIds: [...prev.amenityIds, selectedAmenityId],
      }));
      setSelectedAmenityId("");
      notify.success("Đã thêm tiện ích");
   }

   function handleRemoveAmenity(amenityId: string): void {
      setFormData((prev) => ({
         ...prev,
         amenityIds: prev.amenityIds.filter((id) => id !== amenityId),
      }));
      notify.success("Đã xóa tiện ích");
   }

   function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newMedias: Media[] = Array.from(files).map((file) => ({
         file,
         mediaUrl: URL.createObjectURL(file),
         mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      }));

      setFormData((prev) => ({
         ...prev,
         medias: [...prev.medias, ...newMedias],
      }));
      notify.success(`Đã thêm ${files.length} tệp media`);
      event.target.value = "";
   }

   function handleRemoveMedia(index: number): void {
      const mediaToRemove = formData.medias[index];
      if (mediaToRemove?.mediaUrl?.startsWith("blob:")) {
         URL.revokeObjectURL(mediaToRemove.mediaUrl);
      }
      setFormData((prev) => ({
         ...prev,
         medias: prev.medias.filter((_, i) => i !== index),
      }));
   }

   function handleAddUniversity(): void {
      if (!selectedUniId || uniDistance === "" || Number(uniDistance) <= 0) {
         return notify.error("Vui lòng chọn trường và nhập khoảng cách hợp lệ");
      }
      if (formData.universities.some((u) => u.universityId === selectedUniId)) {
         return notify.error("Trường này đã được thêm rồi");
      }

      setFormData((prev) => ({
         ...prev,
         universities: [
            ...prev.universities,
            { universityId: selectedUniId, distanceKm: Number(uniDistance) },
         ],
      }));
      setSelectedUniId("");
      setUniDistance("");
      notify.success("Đã thêm trường đại học gần đó");
   }

   function handleRemoveUniversity(uniId: string): void {
      setFormData((prev) => ({
         ...prev,
         universities: prev.universities.filter((u) => u.universityId !== uniId),
      }));
   }

   function validateForm(): boolean {
      const newErrors: Record<string, string> = {};
      if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn loại phòng";
      if (!formData.title?.trim()) newErrors.title = "Vui lòng nhập tên phòng";
      if (!formData.price || Number(formData.price) <= 0)
         newErrors.price = "Giá cho thuê phải lớn hơn 0";
      if (
         !formData.area ||
         Number(formData.area) <= 0 ||
         Number(formData.area) > 10000
      )
         newErrors.area = "Diện tích phải lớn hơn 0 và nhỏ hơn 10000";
      if (!formData.streetAddress?.trim())
         newErrors.streetAddress = "Vui lòng nhập địa chỉ cụ thể";

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!formData.contactPhone?.trim()) {
         newErrors.contactPhone = "Vui lòng nhập số điện thoại";
      } else if (!phoneRegex.test(formData.contactPhone.trim())) {
         newErrors.contactPhone = "Số điện thoại không đúng định dạng";
      }

      setErrors(newErrors);

      if (!formData.medias || formData.medias.length === 0) {
         notify.error("Tải lên ít nhất 1 ảnh/video thực tế của phòng");
         return false;
      }

      if (Object.keys(newErrors).length > 0) {
         notify.error("Vui lòng nhập các thông tin còn thiếu");
         return false;
      }
      return true;
   }

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
      e.preventDefault();
      if (!validateForm()) return;

      try {
         setIsSubmitting(true);

         // 1. Lọc lấy danh sách các File mới được chọn
         const rawFiles = formData.medias
            .map((m) => m.file)
            .filter((f): f is File => f instanceof File);

         // 2. Lấy danh sách ID của các hình ảnh/video cũ mà người dùng GIỮ LẠI (chưa bấm xóa)
         const keepMediaIds = formData.medias
            .filter((m) => m.id && !m.file) // Media cũ sẽ có id và KHÔNG có thuộc tính file
            .map((m) => m.id as string);

         const payload: UpdatePost = {
            categoryId: formData.categoryId,
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            price: Number(formData.price),
            area: Number(formData.area),
            deposit: formData.deposit ? Number(formData.deposit) : 0,
            provinceId: Number(formData.provinceId),
            districtId: Number(formData.districtId),
            wardId: Number(formData.wardId),
            streetAddress: formData.streetAddress.trim(),
            contactPhone: formData.contactPhone.trim(),
            amenityIds: formData.amenityIds,
            universities: formData.universities,
            keepMediaIds: keepMediaIds,
         };

         if (editPostId) {
            // MODE UPDATE
            await postApi.update(editPostId, payload, rawFiles);
            notify.success("Cập nhật bài đăng thành công!");
            navigate("/admin/posts");
         } else {
            // MODE CREATE
            const response = await postApi.create(payload as CreatePost, rawFiles);
            notify.success("Đăng bài thành công!");
            navigate(`/${response.category?.slug}/${response.id}`);
         }
      } catch (error) {
         let message = editPostId
            ? "Không thể cập nhật bài đăng."
            : "Không thể tạo bài đăng. Vui lòng thử lại!";

         if (error instanceof AxiosError && error.response?.data?.message) {
            message = String(error.response.data.message);

            // BẮT LỖI TRÙNG TÊN TỪ NESTJS BACKEND ĐỂ MAP VÀO FIELD TITLE
            if (message.includes("Tiêu đề bài đăng này đã tồn tại")) {
               setErrors((prev) => ({
                  ...prev,
                  title: message,
               }));
            }
         }

         notify.error(message);
      } finally {
         setIsSubmitting(false);
      }
   }

   return {
      activeTab,
      setActiveTab,
      categories,
      amenities,
      universities,
      isLoading,
      isSubmitting,
      errors,
      formData,
      setFormData,
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
      isEditMode: Boolean(editPostId),
   };
}
