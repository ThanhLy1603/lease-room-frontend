import type React from "react";

interface FullPageSpinnerProps {
   message?: string;
}

export function FullPageSpinner({ message = "Đang xử lý..." }: FullPageSpinnerProps): React.ReactElement {
   return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
         <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border border-slate-100 min-w-[200px]">
            {/* Spinner xoay ở giữa */}
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-700">{message}</span>
         </div>
      </div>
   );
}