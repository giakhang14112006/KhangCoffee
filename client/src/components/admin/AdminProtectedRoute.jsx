import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children, requireAdmin = false }) {
  const authRaw = localStorage.getItem('khangcoffee_admin_auth');
  let auth = null;
  try {
    auth = authRaw ? JSON.parse(authRaw) : null;
  } catch (e) {
    auth = null;
  }

  if (!auth || !auth.isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const isAdmin = auth.username === 'admin' || auth.role === 'Quản Trị Viên';

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/orders" replace />;
  }

  return children;
}
