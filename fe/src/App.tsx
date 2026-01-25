import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Landing
import LandingPage from './pages/LandingPage';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserManagement from './pages/admin/UserManagement';
import Maps from './pages/Maps';

// Admin Layout & Pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import AnalyzeMenu from './pages/AnalyzeMenu';
import MenuHistory from './pages/MenuHistory';
import Reports from './pages/Reports';
import SchoolManagement from './pages/admin/SchoolManagement';

// User Layout & Pages
import UserLayout from './components/Layout/UserLayout';
import MenuHariIni from './pages/user/MenuHariIni';
import HistorySiswa from './pages/user/HistorySiswa';
import UserLaporan from './pages/user/UserLaporan';
import RequestMenu from './pages/user/RequestMenu';
import PublicLaporan from './pages/PublicLaporan';
import PublicMenuHistory from './pages/PublicMenuHistory';
import TimSPPG from './pages/TimSPPG';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement; allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is defined, check if user's role is included
  if (allowedRoles) {
    if (!allowedRoles.includes(user.role)) {
      console.log('Access Denied:', {
        userRole: user.role,
        allowedRoles,
        hasMatch: allowedRoles.includes(user.role)
      });
      // If user is logged in but unauthorized for this specific route
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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

        {/* Admin Routes (Shared Layout for Admin, Nutritionist, Complaint Officer) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'petugas gizi', 'petugas pengaduan']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          <Route path="analyze" element={
             <ProtectedRoute allowedRoles={['admin', 'petugas gizi']}>
                <AnalyzeMenu />
             </ProtectedRoute>
          } />
          
          <Route path="history" element={
             <ProtectedRoute allowedRoles={['admin', 'petugas gizi']}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
