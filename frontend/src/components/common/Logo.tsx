import type React from "react";

export function Logo(): React.ReactElement {
   const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.location.href = window.location.origin + "/";
   };

   return (
      <a 
         href="/" 
         onClick={handleLogoClick}
         className="flex items-center gap-3 shrink-0 select-none cursor-pointer"
      >
         <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 p-1">
            <svg viewBox="0 0 100 100" className="w-full h-full text-sky-500" fill="currentColor">
               <path d="M50 15 L12 50 L22 50 L22 82 C22 85 24 87 27 87 L73 87 C76 87 78 85 78 82 L78 50 L88 50 Z" />
               <path d="M50 15 C45 5 35 10 38 18 C43 18 47 16 50 15 Z" fill="#22c55e" />
               <path d="M50 15 C55 5 65 10 62 18 C57 18 53 16 50 15 Z" fill="#22c55e" />
               <rect x="33" y="55" width="12" height="12" rx="2" fill="white" />
               <rect x="55" y="55" width="12" height="12" rx="2" fill="white" />
               <path d="M42 87 L42 70 C42 68 44 66 46 66 L54 66 C56 66 58 68 58 70 L58 87 Z" fill="white" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
               <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white" />
            </span>
         </div>
         <div className="flex flex-col">
            <span className="text-xs font-semibold text-green-600 leading-none">Cho thuê căn hộ</span>
            <span className="text-2xl font-black text-sky-500 tracking-tight leading-tight">
               SGHOUSES<span className="text-slate-900">.vn</span>
            </span>
         </div>
      </a>
   );
}