import type React from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import AdminLayout from "../layouts/AdminLayout"
import AdminDashboard from "../pages/admin/AdminDashboard"
import CreatePostPage from "../pages/admin/CreatePostPage"
import EditPostPage from '../pages/admin/EditPostPage';
import AdminPost from '../pages/admin/AdminPost';
import AdminAmenities from '../pages/admin/AdminAmenities';
import AdminUniversities from '../pages/admin/AdminUniversities';
import AdminCategories from '../pages/admin/AdminCategories';

export function AppRoutes(): React.ReactElement {
   return (
      <Routes>
         {/* Public Routes */}
         <Route path="/" element={<HomePage />} />
         <Route path="/:slug/:id" element={<PostDetailPage />} />
         <Route path="/login" element={<LoginPage />} />

         {/* Protected Routes (Cần đăng nhập) */}
         <Route element={<ProtectedRoute />}>
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/edit-post/:id" element={<EditPostPage />}/>

            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<AdminDashboard/>} />
               <Route path="posts" element={<AdminPost />} />
               <Route path="categories" element={<AdminCategories/> }/>
               <Route path="universities" element={<AdminUniversities />} />
               <Route path="amenities" element={<AdminAmenities />} />
            </Route>
         </Route>
      </Routes>
   );
}