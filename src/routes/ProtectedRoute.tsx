import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUIStore();

  if (!isAuthenticated) {
    // Defer state update to avoid updating UI store during render
    setTimeout(() => openAuthModal('login'), 0);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
