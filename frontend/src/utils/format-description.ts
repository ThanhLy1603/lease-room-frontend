export function formatDescription(content: string): string {
   if (!content) return '';

   // Kiểm tra xem chuỗi có chứa thẻ HTML hay không
   const isHtml = /<[a-z][\s\S]*>/i.test(content);

   if (isHtml) {
      return content;
   }

   // Tách các dòng ra và bọc trong thẻ <p>, dòng trống thì chuyển thành <br />
   return content
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '<br />')
      .join('');
}