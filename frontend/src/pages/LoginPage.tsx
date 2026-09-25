import type React from "react";
import { useState, type FormEvent } from "react";
import { Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authApi } from "../api/auth.api";
import { FullPageSpinner } from "../components/common/FullPageSpinner";
import { useAuth } from "../hooks/useAuth";

export function LoginPage(): React.ReactElement {
   const navigate = useNavigate();
   const { login } = useAuth();

   const [phone, setPhone] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);

   async function handleSubmit(e: FormEvent): Promise<void> {
      e.preventDefault();

      // 1. Validation Frontend với SweetAlert2
      if (!phone.trim() || !password.trim()) {
         Swal.fire({
            icon: "warning",
            title: "Thiếu thông tin!",
            text: "Vui lòng nhập đầy đủ số điện thoại và mật khẩu.",
            confirmButtonText: "Đã hiểu",
            confirmButtonColor: "#2563eb", // Màu blue-600 khớp với theme
         });
         return;
      }

      try {
         setLoading(true);

         const token = await authApi.login({
            phone: phone.trim(),
            password: password,
         });

         if (token) {
            login(token);

            // Toast thông báo thành công ngắn trước khi chuyển trang
            Swal.fire({
               icon: "success",
               title: "Đăng nhập thành công!",
               timer: 1500,
               showConfirmButton: false,
            });

            navigate("/");
         }
      } catch (error: any) {
         console.error("Lỗi đăng nhập: ", error);

         // Lấy thông điệp lỗi từ Backend
         const apiMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!";

         // 2. Alert thông báo thất bại
         Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại!",
            text: apiMessage,
            confirmButtonText: "Thử lại",
            confirmButtonColor: "#ef4444", // Màu red-500
         });
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 antialiased relative">
         {/* Hiển thị Loading chính giữa màn hình */}
         {loading && <FullPageSpinner message="Đang đăng nhập..." />}

         {/* MAIN LOGIN CARD */}
         <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-slate-100">
            {/* Header / Logo */}
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-3">
                  <LogIn className="w-6 h-6" />
               </div>
               <h1 className="text-2xl font-bold text-slate-900">Đăng Nhập</h1>
               <p className="text-sm text-slate-500 mt-1">
                  Chào mừng bạn quay trở lại!
               </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                     Số điện thoại
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                     </div>
                     <input
                        id="phone"
                        type="text"
                        placeholder="Nhập số điện thoại..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                     />
                  </div>
               </div>

               <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                     Mật khẩu
                  </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                     </div>
                     <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                     >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                     <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                     />
                     <span>Ghi nhớ tôi</span>
                  </label>
                  <Link
                     to="/forgot-password"
                     className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                     Quên mật khẩu?
                  </Link>
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
               >
                  <span>Đăng nhập</span>
                  <LogIn className="w-4 h-4" />
               </button>
            </form>

            <div className="mt-8 text-center text-xs sm:text-sm text-slate-500">
               Chưa muốn đăng nhập?{" "}
               <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Quay lại trang chủ
               </Link>
            </div>
         </div>
      </div>
   );
}