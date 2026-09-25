import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface GoogleMapEmbedProps {
   readonly address: string;
}

export function GoogleMapEmbed({ address }: GoogleMapEmbedProps): React.ReactElement {
   const [shouldLoadMap, setShouldLoadMap] = useState<boolean>(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const encodedAddress = encodeURIComponent(address);
   const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

   useEffect(() => {
      // Lazy load iframe khi người dùng cuộn còn cách bản đồ 200px
      const observer = new IntersectionObserver(
         (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
               // Delay nhẹ 300ms nhường Main Thread cho UI render xong hẳn
               const timer = setTimeout(() => {
                  setShouldLoadMap(true);
               }, 300);
               observer.disconnect();
               return () => clearTimeout(timer);
            }
         },
         { rootMargin: "200px" }
      );

      if (containerRef.current) {
         observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
   }, []);

   return (
      <div
         ref={containerRef}
         className="w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 relative"
      >
         {!shouldLoadMap ? (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-400">
               <MapPin className="w-6 h-6 mb-2 text-slate-400 animate-pulse" />
               <p className="text-xs font-medium text-slate-500">Đang chuẩn bị bản đồ...</p>
            </div>
         ) : (
            <iframe
               title={`Bản đồ vị trí ${address}`}
               src={mapUrl}
               width="100%"
               height="100%"
               style={{ border: 0 }}
               allowFullScreen={false}
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               className="w-full h-full"
            />
         )}
      </div>
   );
}