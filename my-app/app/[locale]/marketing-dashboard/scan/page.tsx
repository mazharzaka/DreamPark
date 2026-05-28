'use client';

import React from 'react';
import { AgentScanner } from '@/src/features/scanner/components/AgentScanner';
import { ProtectedRoute } from '@/src/lib/features/auth/ProtectedRoute';

export default function ScanPage() {
  return (
    <ProtectedRoute allowedRoles={['MARKETING_AGENT', 'ADMIN']}>
      <main className="flex-1 bg-surface py-12 flex items-center justify-center">
        <AgentScanner />
      </main>
    </ProtectedRoute>
  );
}
