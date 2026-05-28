'use client';

import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

import { Link } from '@/src/i18n/routing';

export const ForbiddenScreen: React.FC = () => {


  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-cairo">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-surface-low rounded-3xl p-8 max-w-lg shadow-ambient relative overflow-hidden"
      >
        {/* Asymmetric layout energy */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-secondary/5 rounded-full" />

        <div className="bg-[#b5161e]/10 p-6 rounded-full inline-block mb-6 relative">
          <ShieldAlert className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-3xl font-black text-on-surface mb-3 leading-tight">
          عذراً، الوصول غير مصرح به!
        </h1>
        <p className="text-on-surface/70 leading-relaxed mb-8 max-w-sm mx-auto">
          ليس لديك الصلاحيات اللازمة لعرض هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مسؤول النظام.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-90 font-bold shadow-md transition"
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-surface-lowest text-on-surface hover:bg-surface-lowest/80 font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            الرجوع للخلف
          </button>
        </div>
      </motion.div>
    </div>
  );
};
