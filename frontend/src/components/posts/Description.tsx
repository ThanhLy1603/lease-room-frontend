// src/components/post/DescriptionSection.tsx
import React from 'react';
import { AlignLeft } from 'lucide-react';
import RichTextEditor from '../common/RichTextEditor';

interface DescriptionSectionProps {
   readonly value: string;
   readonly onChange: (html: string) => void;
}

export default function DescriptionSection({
   value,
   onChange,
}: DescriptionSectionProps): React.ReactElement {
   return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
         <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-blue-600" />
            Mô Tả Chi Tiết
         </h2>

         {/* RichTextEditor nhận giá trị html và trả về chuỗi html mới */}
         <RichTextEditor content={value} onChange={onChange} />
      </div>
   );
}