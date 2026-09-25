// src/App.tsx
import type React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 

import { AuthProvider } from './context/AuthProvider';
import { AppRoutes } from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';

function App(): React.ReactElement {
   return (
      <HelmetProvider>
         <AuthProvider>
            <BrowserRouter>
               <ScrollToTop/>
               <AppRoutes />
            </BrowserRouter>
         </AuthProvider>
      </HelmetProvider>
   );
}

export default App;