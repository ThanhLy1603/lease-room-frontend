import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
   readonly content: string;
   readonly onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps): React.ReactElement {
   const editor = useEditor({
      extensions: [
         StarterKit.configure({
            heading: {
               levels: [2, 3], // Giới hạn chỉ dùng H2, H3 nếu cần
            },
         }),
      ],
      content: content,
      onUpdate: ({ editor }) => {
         onChange(editor.getHTML()); // Xuất ra chuỗi HTML để lưu vào state/DB
      },
      editorProps: {
         attributes: {
            class:
               'focus:outline-none min-h-[140px] p-3 text-sm font-normal text-slate-800 prose max-w-none focus:bg-white transition-all',
         },
      },
   });

   // Cập nhật nội dung editor khi giá trị props content thay đổi từ bên ngoài (ví dụ: Reset Form hoặc Edit Post)
   useEffect(() => {
      if (editor && content !== editor.getHTML()) {
         editor.commands.setContent(content || '');
      }
   }, [content, editor]);

   if (!editor) {
      return (
         <div className="bg-slate-50 border border-slate-200 rounded-xl min-h-[180px] animate-pulse" />
      );
   }

   return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
         {/* Thanh công cụ (Toolbar) */}
         <div className="flex items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200 flex-wrap">
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleBold().run()}
               className={`px-2.5 py-1 text-xs font-bold rounded transition ${
                  editor.isActive('bold')
                     ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                     : 'text-slate-600 hover:bg-slate-200'
               }`}
            >
               B
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleItalic().run()}
               className={`px-2.5 py-1 text-xs italic font-serif rounded transition ${
                  editor.isActive('italic')
                     ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                     : 'text-slate-600 hover:bg-slate-200'
               }`}
            >
               I
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleStrike().run()}
               className={`px-2.5 py-1 text-xs line-through rounded transition ${
                  editor.isActive('strike')
                     ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                     : 'text-slate-600 hover:bg-slate-200'
               }`}
            >
               S
            </button>

            <div className="w-[1px] h-4 bg-slate-300 mx-1" />

            <button
               type="button"
               onClick={() => editor.chain().focus().toggleBulletList().run()}
               className={`px-2.5 py-1 text-xs rounded transition ${
                  editor.isActive('bulletList')
                     ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                     : 'text-slate-600 hover:bg-slate-200'
               }`}
            >
               • Danh sách
            </button>
            <button
               type="button"
               onClick={() => editor.chain().focus().toggleOrderedList().run()}
               className={`px-2.5 py-1 text-xs rounded transition ${
                  editor.isActive('orderedList')
                     ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                     : 'text-slate-600 hover:bg-slate-200'
               }`}
            >
               1. Số thứ tự
            </button>
         </div>

         {/* Khu vực nhập nội dung */}
         <EditorContent editor={editor} />
      </div>
   );
}