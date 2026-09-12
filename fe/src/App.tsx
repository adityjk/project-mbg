import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy-load all page components for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const Maps = lazy(() => import('./pages/Maps'));
const Layout = lazy(() => import('./components/Layout/Layout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AnalyzeMenu = lazy(() => import('./pages/AnalyzeMenu'));
const MenuHistory = lazy(() => import('./pages/MenuHistory'));
const Reports = lazy(() => import('./pages/Reports'));
const SchoolManagement = lazy(() => import('./pages/admin/SchoolManagement'));
const TimSPPGManagement = lazy(() => import('./pages/admin/TimSPPGManagement'));
const UserLayout = lazy(() => import('./components/Layout/UserLayout'));
const MenuHariIni = lazy(() => import('./pages/user/MenuHariIni'));
const HistorySiswa = lazy(() => import('./pages/user/HistorySiswa'));
const UserLaporan = lazy(() => import('./pages/user/UserLaporan'));
const RequestMenu = lazy(() => import('./pages/user/RequestMenu'));
const PublicLaporan = lazy(() => import('./pages/PublicLaporan'));
const PublicMenuHistory = lazy(() => import('./pages/PublicMenuHistory'));
const TimSPPG = lazy(() => import('./pages/TimSPPG'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement; allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Public Maps Route */}
        <Route path="/maps" element={<Maps />} />
        
        {/* Public Report Route (Anonymous) */}
        <Route path="/aduan" element={<PublicLaporan />} />
        
        {/* Public Menu History */}
        <Route path="/menu-history" element={<PublicMenuHistory />} />
        
        {/* Tim SPPG */}
        <Route path="/tim-sppg" element={<TimSPPG />} />

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MenuHariIni />} />
          <Route path="history" element={<HistorySiswa />} />
          <Route path="laporan" element={<UserLaporan />} />
          <Route path="request" element={<RequestMenu />} />
        </Route>

        {/* Admin Routes (Shared Layout for Admin, Nutritionist, Complaint Officer, Super Admin) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'petugas gizi', 'petugas pengaduan']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Super admin CANNOT access analyze - only view history */}
          <Route path="analyze" element={
             <ProtectedRoute allowedRoles={['admin', 'petugas gizi']}>
                <AnalyzeMenu />
             </ProtectedRoute>
          } />
          
          {/* Super admin CAN view menu history (read-only in backend) */}
          <Route path="history" element={
             <ProtectedRoute allowedRoles={['admin', 'super_admin', 'petugas gizi']}>
                <MenuHistory />
             </ProtectedRoute>
          } />
          
          <Route path="reports" element={
             <ProtectedRoute allowedRoles={['admin', 'petugas pengaduan']}>
                <Reports />
             </ProtectedRoute>
          } />
          
          <Route path="users" element={
             <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
             </ProtectedRoute>
          } />
          
          <Route path="schools" element={
             <ProtectedRoute allowedRoles={['admin', 'petugas gizi']}>
                <SchoolManagement />
             </ProtectedRoute>
          } />
          
          <Route path="tim-sppg" element={
             <ProtectedRoute allowedRoles={['admin']}>
                <TimSPPGManagement />
             </ProtectedRoute>
          } />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
