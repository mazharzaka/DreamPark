'use client';

import React from 'react';
import { ProtectedRoute } from '@/src/lib/features/auth/ProtectedRoute';
import { Landmark, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FinancialPage() {
  const t = useTranslations('Financial');

  return (
    <ProtectedRoute allowedRoles={['FINANCIAL_MANAGER', 'ADMIN']}>
      <main className="flex-grow bg-surface py-12 px-6 font-cairo mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center md:text-right">
            <h1 className="text-3xl font-black text-on-surface">لوحة التحكم المالية</h1>
            <p className="text-on-surface/60 mt-1">التقارير اليومية، الإيرادات المباشرة ومراجعة البوابة</p>
          </div>

          {/* Cards metrics using strict Editorial Joy style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-low rounded-2xl p-6 shadow-ambient">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface/60 text-sm">مبيعات اليوم النقدي</span>
                <DollarSign className="w-8 h-8 text-emerald" />
              </div>
              <h2 className="text-2xl font-black text-on-surface font-plus-jakarta-sans">1,245,000 IQD</h2>
            </div>
            <div className="bg-surface-low rounded-2xl p-6 shadow-ambient">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface/60 text-sm">إجمالي التذاكر النشطة</span>
                <Landmark className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-black text-on-surface font-plus-jakarta-sans">158 تذكرة</h2>
            </div>
            <div className="bg-surface-low rounded-2xl p-6 shadow-ambient">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface/60 text-sm">معدل الدخول الفعلي</span>
                <TrendingUp className="w-8 h-8 text-[#ff766d]" />
              </div>
              <h2 className="text-2xl font-black text-on-surface font-plus-jakarta-sans">87 %</h2>
            </div>
            <div className="bg-surface-low rounded-2xl p-6 shadow-ambient">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface/60 text-sm">تحصيل الخزينة المتوقع</span>
                <Wallet className="w-8 h-8 text-tertiary" />
              </div>
              <h2 className="text-2xl font-black text-on-surface font-plus-jakarta-sans">2,100,000 IQD</h2>
            </div>
          </div>

          {/* Tonal list */}
          <div className="bg-surface-low rounded-3xl p-6 shadow-ambient">
            <h3 className="text-xl font-bold text-on-surface mb-4">مراجعة المعاملات النقدية الأخيرة</h3>
            <div className="space-y-4">
              <div className="bg-surface-lowest p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-on-surface">مصطفى اليوزر</h4>
                  <p className="text-xs text-on-surface/50">بواسطة: أحمد الوكيل</p>
                </div>
                <div className="text-right">
                  <h5 className="font-black text-emerald font-plus-jakarta-sans">+ 67,500 IQD</h5>
                  <p className="text-xxs text-on-surface/40">منذ دقيقتين</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
