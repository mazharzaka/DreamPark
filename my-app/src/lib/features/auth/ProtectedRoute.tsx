'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { ForbiddenScreen } from '../../../components/ui/ForbiddenScreen';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'MARKETING_AGENT' | 'FINANCIAL_MANAGER' | 'ADMIN' | 'customer' | 'staff' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // 1) Render a highly polished, pulse-based Editorial-Joy loader skeleton while mounting/fetching profiles
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-surface text-center">
        <div className="w-16 h-16 bg-surface-low rounded-full flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="space-y-3 w-48 animate-pulse">
          <div className="h-4 bg-surface-low rounded-full w-3/4 mx-auto" />
          <div className="h-3 bg-surface-low rounded-full w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  // 2) Access denied if unauthenticated
  if (!isAuthenticated) {
    return null;
  }

  // 3) Role checking with robust normalisation to uppercase
  if (allowedRoles && user) {
    const userRole = user.role.toUpperCase().trim();
    // Normalize both user role and allowed list for comparison
    const normalizedUserRole = userRole === 'CUSTOMER' ? 'USER' :
                               userRole === 'STAFF' ? 'MARKETING_AGENT' :
                               userRole === 'ADMIN' ? 'ADMIN' : userRole;

    const normalizedAllowedRoles = allowedRoles.map((r) => {
      const upper = r.toUpperCase().trim();
      return upper === 'CUSTOMER' ? 'USER' :
             upper === 'STAFF' ? 'MARKETING_AGENT' :
             upper === 'ADMIN' ? 'ADMIN' : upper;
    });

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return <ForbiddenScreen />;
    }
  }

  return <>{children}</>;
};
