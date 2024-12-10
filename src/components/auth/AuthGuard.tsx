import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresPro?: boolean;
}

export function AuthGuard({ children, requiresPro = false }: AuthGuardProps) {
  const { user, isProUser } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiresPro && !isProUser) {
    return <Navigate to="/chat-lite" />;
  }

  return <>{children}</>;
}