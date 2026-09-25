import type React from "react";
import { useState } from "react";
import { Search, LogOut, User as UserIcon, LayoutDashboard, PlusCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FullPageSpinner } from "./FullPageSpinner";
import { Logo } from './Logo';
import { useAuth } from "../../hooks/useAuth";

export function Header(): React.ReactElement {
   const loginUrl = "/login";
   const homeUrl = "/";

   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const { user, logout } = useAuth();

   const [searchKeyword, setSearchKeyword] = useState<string>(searchParams.get('search') || '');
   const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
   const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

   async function handleLogout(): Promise<void> {
      try {
         setIsLoggingOut(true);
         await new Promise((resolve) => setTimeout(resolve, 500));

         logout();
         navigate(homeUrl);
      } catch (error) {
         console.error("Lỗi đăng xuất:", error);
      } finally {
         setIsLoggingOut(false);
      }
   }

   function handleSearch(e: React.FormEvent): void {
      e.preventDefault();
      const trimmedKeyword = searchKeyword.trim();
      if (trimmedKeyword) {
         navigate(`/?search=${encodeURIComponent(trimmedKeyword)}`);
      } else {
         navigate('/');
      }
   }

   return (
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
         {isLoggingOut && <FullPageSpinner message="Đang đăng xuất..." />}

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
               <Logo />

               {/* Search Bar */}
               <form
                  onSubmit={handleSearch}
                  className="hidden md:flex flex-1 max-w-xl items-center bg-slate-100 rounded-full border border-slate-200 px-4 py-1.5 hover:bg-white hover:border-blue-400 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all"
               >
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                     type="text"
                     value={searchKeyword}
                     onChange={(e) => setSearchKeyword(e.target.value)}
                     placeholder="Tìm theo khu vực, trường ĐH (vd: UEH, Nguyễn Thị Thập)..."
                     className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ml-2 shrink-0">
                     Tìm kiếm
                  </button>
               </form>

               {/* Action Buttons */}
               <div className="flex items-center gap-3">
                  <Link
                     to={user ? "/create-post" : loginUrl}
                     className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
                  >
                     <PlusCircle className="w-4 h-4" /> Đăng tin
                  </Link>

                  {user ? (
                     <div className="relative">
                        {/* Avatar & User Button */}
                        <button
                           type="button"
                           onClick={() => setShowUserMenu(!showUserMenu)}
                           className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                        >
                           <UserIcon className="w-4 h-4 text-blue-600" />
                           <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                              {user.fullName || user.phone}
                           </span>
                        </button>

                        {/* Dropdown Menu khi bấm vào User */}
                        {showUserMenu && (
                           <div
                              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                              onMouseLeave={() => setShowUserMenu(false)}
                           >
                              <Link
                                 to="/admin"
                                 onClick={() => setShowUserMenu(false)}
                                 className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                 <LayoutDashboard className="w-4 h-4 text-blue-600" /> Trang quản trị Admin
                              </Link>

                              <button
                                 type="button"
                                 onClick={() => {
                                    setShowUserMenu(false);
                                    handleLogout();
                                 }}
                                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                              >
                                 <LogOut className="w-4 h-4" /> Đăng xuất
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <Link
                        to={loginUrl}
                        className="text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors"
                     >
                        Đăng nhập
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}