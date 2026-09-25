/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
   LayoutDashboard,
   FileText,
   GraduationCap,
   Grid,
   LogOut,
   Home,
   PlusCircle,
   User as UserIcon,
   Building2,
   ChevronRight,
   FolderTree,
   Menu,
   X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FullPageSpinner } from '../components/common/FullPageSpinner';
import { Logo } from '../components/common/Logo';

export default function AdminLayout(): React.ReactElement {
   const { user, logout } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();

   const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

   const menuItems = [
      { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
      { path: '/admin/posts', label: 'Quản lý bài đăng', icon: FileText },
      { path: '/admin/categories', label: 'Quản lý danh mục', icon: FolderTree },
      { path: '/admin/universities', label: 'Trường đại học', icon: GraduationCap },
      { path: '/admin/amenities', label: 'Tiện ích', icon: Grid },
   ];

   // Tự động đóng Mobile Menu khi đổi route
   useEffect(() => {
      setIsMobileMenuOpen(false);
   }, [location.pathname]);

   useEffect(() => {
      const currentItem = menuItems.find((item) =>
         item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path)
      );

      const titleLabel = currentItem ? currentItem.label : 'Quản trị hệ thống';
      document.title = `${titleLabel} | Admin SGHOUSES`;

      let metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      let createdMeta = false;

      if (!metaRobots) {
         metaRobots = document.createElement('meta');
         metaRobots.name = 'robots';
         createdMeta = true;
      }
      const previousRobotsValue = metaRobots.content;
      metaRobots.content = 'noindex, nofollow, noarchive';

      if (createdMeta) {
         document.head.appendChild(metaRobots);
      }

      return () => {
         if (createdMeta && metaRobots) {
            metaRobots.remove();
         } else if (metaRobots) {
            metaRobots.content = previousRobotsValue || 'index, follow';
         }
      };
   }, [location.pathname, menuItems]);

   async function handleLogout(): Promise<void> {
      try {
         setIsLoggingOut(true);
         await new Promise((resolve) => setTimeout(resolve, 500));
         logout();
         navigate('/');
      } catch (error) {
         console.error('Lỗi đăng xuất:', error);
      } finally {
         setIsLoggingOut(false);
      }
   }

   return (
      <div className="min-h-screen flex bg-slate-100/80 text-slate-900 antialiased font-sans">
         {isLoggingOut && <FullPageSpinner message="Đang đăng xuất..." />}

         {/* Mobile Drawer Overlay */}
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
               onClick={() => setIsMobileMenuOpen(false)}
            />
         )}

         {/* Sidebar (Drawer trên Mobile, Sticky Sidebar trên Desktop) */}
         <aside
            className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-slate-700 flex flex-col shrink-0 border-r border-slate-200/90 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
               isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
         >
            {/* Logo Admin */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
               <Logo />
               <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg bg-slate-100"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Điều hướng Menu Sidebar */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
               <div className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quản lý hệ thống
               </div>
               {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                     item.path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.path);

                  return (
                     <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                           isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-1'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                        }`}
                     >
                        <div className="flex items-center gap-3">
                           <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                           <span className="text-sm font-semibold">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                     </Link>
                  );
               })}
            </nav>

            {/* Chân Sidebar */}
            <div className="p-4 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
               <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-xs"
               >
                  <Home className="w-5 h-5 text-slate-500" /> Về trang chủ
               </Link>
               <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left"
               >
                  <LogOut className="w-5 h-5" /> Đăng xuất
               </button>
            </div>
         </aside>

         {/* Khu vực Nội dung chính */}
         <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header Admin */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs">
               <div className="flex items-center gap-3">
                  <button
                     type="button"
                     onClick={() => setIsMobileMenuOpen(true)}
                     className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                     <Menu className="w-5 h-5" />
                  </button>

                  <div className="hidden sm:flex p-2 bg-blue-50 rounded-xl border border-blue-100">
                     <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                     BẢNG ĐIỀU KHIỂN QUẢN TRỊ
                  </h1>
               </div>

               {/* Tác vụ trên Top Header */}
               <div className="flex items-center gap-2 sm:gap-4">
                  <Link
                     to="/create-post"
                     className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 sm:gap-2 active:scale-95 whitespace-nowrap"
                  >
                     <PlusCircle className="w-4 h-4" />
                     <span className="hidden sm:inline">Đăng tin mới</span>
                     <span className="sm:hidden">Đăng tin</span>
                  </Link>

                  <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

                  {/* Account Admin Info */}
                  <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border border-slate-200/80">
                     <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                     </div>
                     <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[100px] sm:max-w-none">
                        {user?.fullName || user?.phone || 'Admin'}
                     </span>
                  </div>
               </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto bg-slate-100/60">
               <div className="max-w-7xl mx-auto space-y-6">
                  <Outlet />
               </div>
            </main>
         </div>
      </div>
   );
}