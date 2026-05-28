'use client';

import React from 'react';
import { AdminPricing } from '@/src/features/admin/components/AdminPricing';
import { ProtectedRoute } from '@/src/lib/features/auth/ProtectedRoute';

export default function PricingPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <main className="flex-1 bg-surface py-12 px-4 flex items-center justify-center mt-20">
        <AdminPricing />
      </main>
    </ProtectedRoute>
  );
}
