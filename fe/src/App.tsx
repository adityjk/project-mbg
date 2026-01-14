import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Landing
import LandingPage from './pages/LandingPage';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Maps from './pages/Maps';

// Admin Layout & Pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import AnalyzeMenu from './pages/AnalyzeMenu';
import MenuHistory from './pages/MenuHistory';
import Reports from './pages/Reports';

// User Layout & Pages
import UserLayout from './components/Layout/UserLayout';
import MenuHariIni from './pages/user/MenuHariIni';
import UserLaporan from './pages/user/UserLaporan';
import RequestMenu from './pages/user/RequestMenu';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role?: 'admin' | 'user' }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Redirect if unauthorized role
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

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MenuHariIni />} />
          <Route path="laporan" element={<UserLaporan />} />
          <Route path="request" element={<RequestMenu />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="analyze" element={<AnalyzeMenu />} />
          <Route path="history" element={<MenuHistory />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
