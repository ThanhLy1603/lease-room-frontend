import type { ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';

export default function CustomToaster(): ReactElement {
   return (
      <Toaster
         position="top-right"
         toastOptions={{
            duration: 3500,
            style: {
               background: 'rgba(255, 255, 255, 0.95)',
               color: '#1e293b',
               backdropFilter: 'blur(8px)',
               boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
               borderRadius: '16px',
               padding: '12px 18px',
               fontSize: '14px',
               fontWeight: '500',
               border: '1px solid rgba(226, 232, 240, 0.8)',
            },
            success: {
               iconTheme: {
                  primary: '#10b981', // Xanh mướt e-commerce
                  secondary: '#ffffff',
               },
               style: {
                  borderLeft: '4px solid #10b981',
               },
            },
            error: {
               iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
               },
               style: {
                  borderLeft: '4px solid #ef4444',
               },
            },
         }}
      />
   );
}