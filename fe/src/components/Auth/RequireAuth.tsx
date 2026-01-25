import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireAuth ensures a user is logged in and optionally checks role.
 * If not authenticated, redirects to /login.
 * If a role is provided and the user's role does not match, redirects to home.
 */
export default function RequireAuth({ children, role }: { children: React.ReactElement; role?: 'admin' | 'user' }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
