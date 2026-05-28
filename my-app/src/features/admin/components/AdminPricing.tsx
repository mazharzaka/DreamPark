'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Crown, Ticket, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  useGetTicketTypesQuery,
  useUpdateTicketPriceMutation,
} from '../../../lib/features/api/bookingsApi';

export const AdminPricing: React.FC = () => {
  const t = useTranslations('Pricing');
  const { data: ticketTypesData, isLoading: isFetching, refetch } = useGetTicketTypesQuery();
  const [updatePrice, { isLoading: isUpdating }] = useUpdateTicketPriceMutation();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newDiscount, setNewDiscount] = useState<number | ''>('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || newPrice === '') return;
    
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await updatePrice({
        ticketTypeId: selectedTicketId,
        newPrice: Number(newPrice),
      }).unwrap();

      if (response.success) {
        setSuccessMsg('تم تحديث سعر التذكرة بنجاح!');
        setSelectedTicketId(null);
        setNewPrice('');
        setNewDiscount('');
        refetch();
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'حدث خطأ أثناء تحديث السعر');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-12 h-12 text-[#b5161e] animate-spin" />
      </div>
    );
  }

  const ticketTypes = ticketTypesData?.data || [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-cairo">
      <div className="bg-surface-low rounded-3xl p-6 shadow-ambient">
        <h1 className="text-3xl font-black text-on-surface mb-2 text-center md:text-right">
          إدارة أسعار التذاكر
        </h1>
        <p className="text-on-surface/60 text-sm mb-8 text-center md:text-right">
          تعديل أسعار الدخول وباقات الألعاب مع الحفاظ على البيانات التاريخية
        </p>

        {successMsg && (
          <div className="bg-emerald-500/10 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <p className="font-bold text-sm leading-relaxed">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#b5161e]/10 text-[#b5161e] p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-bold text-sm leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Dynamic Card Grid (Tonal Layering Compliance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => {
                setSelectedTicketId(ticket.id);
                setNewPrice(ticket.price);
                setNewDiscount(ticket.discount || 0);
              }}
              className={`p-6 rounded-2xl cursor-pointer transition shadow-sm flex items-start gap-4 ${
                selectedTicketId === ticket.id
                  ? 'bg-surface-lowest ring-2 ring-[#b5161e]/20'
                  : 'bg-surface-lowest hover:bg-surface-lowest/70'
              }`}
            >
              <div className="p-4 rounded-full bg-surface-low text-primary shrink-0">
                {ticket.icon === 'Crown' ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : (
                  <Ticket className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-on-surface text-lg">{ticket.nameAr}</h3>
                <span className="text-xs text-on-surface/50 font-plus-jakarta-sans block mt-1">
                  {ticket.name}
                </span>
                <div className="flex items-baseline gap-2 justify-end mt-4">
                  <h2 className="text-2xl font-black text-[#b5161e] font-plus-jakarta-sans">
                    {ticket.price.toLocaleString()}
                  </h2>
                  <span className="text-xs text-on-surface/60">IQD</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Update Form (Strict "No-Line" Rule Inputs) */}
        {selectedTicketId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-lowest p-6 rounded-2xl shadow-ambient"
          >
            <h3 className="text-xl font-bold text-on-surface mb-6">
              تعديل سعر الباقة المحددة
            </h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-on-surface/70 mb-2">
                  السعر الأساسي الجديد (دينار عراقي)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : '')}
                  required
                  placeholder="مثال: 45000"
                  className="w-full bg-surface-low text-on-surface p-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-right font-plus-jakarta-sans"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedTicketId(null)}
                  className="py-3 px-6 rounded-full bg-surface-low text-on-surface hover:bg-surface-low/80 font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-90 font-bold shadow-md transition disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'حفظ السعر الجديد'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};
