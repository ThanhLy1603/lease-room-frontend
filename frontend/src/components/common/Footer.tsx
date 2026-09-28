import type React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";
import { Logo } from "./Logo";

export function Footer(): React.ReactElement {
   return (
      <footer className="bg-slate-50 text-slate-600 mt-20 border-t border-slate-200 text-sm">
         {/* Top Footer / Content */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
               
               {/* Cột 1: Thông tin thương hiệu & Logo */}
               <div className="lg:col-span-2 space-y-4">
                  <Logo />
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
                     SGHOUSES.vn - Kênh thông tin tìm kiếm & đăng tin cho thuê phòng trọ, nhà nguyên căn, căn hộ uy tín hàng đầu toàn quốc.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-100">
                     <ShieldCheck className="w-4 h-4 text-blue-600" />
                     <span>Thông tin phòng trọ được xác thực minh bạch</span>
                  </div>
               </div>

               {/* Cột 2: Danh mục cho thuê */}
               <div className="space-y-3">
                  <h3 className="text-slate-900 font-semibold text-sm">Cho Thuê</h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Cho thuê phòng trọ
                        </Link>
                     </li>
                     <li>
                        <Link to="/#" className="hover:text-blue-600 transition-colors">
                           Cho thuê căn hộ
                        </Link>
                     </li>
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Nhà nguyên căn
                        </Link>
                     </li>
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Tìm người ở ghép
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Cột 3: Hỗ trợ khách hàng */}
               <div className="space-y-3">
                  <h3 className="text-slate-900 font-semibold text-sm">Hỗ Trợ Khách Hàng</h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Hướng dẫn đăng tin
                        </Link>
                     </li>
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Bảng giá dịch vụ
                        </Link>
                     </li>
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Quy định đăng tin
                        </Link>
                     </li>
                     <li>
                        <Link to="#" className="hover:text-blue-600 transition-colors">
                           Chính sách bảo mật
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Cột 4: Thông tin liên hệ */}
               <div className="space-y-3">
                  <h3 className="text-slate-900 font-semibold text-sm">Liên Hệ</h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                     <li className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>TP. Hồ Chí Minh, Việt Nam</span>
                     </li>
                     <li className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">038 470 6400</span>
                     </li>
                     <li className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>cskh@sghouses.vn</span>
                     </li>
                  </ul>
               </div>

            </div>
         </div>

         {/* Bottom Footer / Copyright */}
         <div className="border-t border-slate-200 bg-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
               <div>
                  © 2026 <span className="text-slate-800 font-semibold">SGHOUSES.vn</span>. All rights reserved.
               </div>
               <div className="flex items-center gap-1">
                  <span>Phát triển với</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>cho cộng đồng sinh viên & người đi làm</span>
               </div>
            </div>
         </div>
      </footer>
   );
}