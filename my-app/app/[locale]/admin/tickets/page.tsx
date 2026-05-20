"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Edit2 } from "lucide-react";
import { useGetTicketTypesQuery, useUpdateTicketPriceMutation } from "@/src/lib/features/api/bookingsApi";

export default function AdminPricingBoard() {
  const { data: typesRes, isLoading } = useGetTicketTypesQuery();
  const [updateTicketPrice, { isLoading: updating }] = useUpdateTicketPriceMutation();

  const ticketTypes = typesRes?.data ?? [];

  // Local edit prices state initialised from fetched data
  const [editPrices, setEditPrices] = useState<{ [id: string]: number }>({});
  const [feedback, setFeedback] = useState<{ id: string; message: string; type: "success" | "error" } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (ticketTypes.length > 0) {
      const initial: { [id: string]: number } = {};
      ticketTypes.forEach((t) => { initial[t.id] = t.price; });
      setEditPrices(initial);
    }
  }, [ticketTypes]);

  const handlePriceChange = (id: string, value: string) => {
    const num = parseFloat(value);
    setEditPrices((prev) => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
  };

  const handleSave = async (id: string) => {
    setUpdatingId(id);
    setFeedback(null);
    try {
      await updateTicketPrice({ ticketTypeId: id, newPrice: editPrices[id] }).unwrap();
      setFeedback({ id, message: "تم تحديث السعر بنجاح", type: "success" });
    } catch (err: any) {
      setFeedback({ id, message: err?.data?.error ?? "فشل التحديث", type: "error" });
    }
    setUpdatingId(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-8 rtl" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-[#005caa] text-4xl font-extrabold mb-2 font-['Plus_Jakarta_Sans']">
            لوحة إدارة الأسعار
          </h1>
          <p className="text-[#2d2f2f] opacity-70">إدارة وتحديث أسعار تذاكر ماجيك باس في الوقت الفعلي.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#005caa] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketTypes.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(45,47,47,0.04)] hover:shadow-[0_40px_80px_rgba(45,47,47,0.08)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#2d2f2f] mb-1">{ticket.name}</h3>
                    {ticket.description && (
                      <p className="text-sm text-[#2d2f2f] opacity-60 line-clamp-2">{ticket.description}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#f6f6f6] flex items-center justify-center text-[#755700]">
                    <Edit2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2d2f2f] opacity-75 mb-2">
                      السعر الحالي (جنيه)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={editPrices[ticket.id] === 0 ? "" : (editPrices[ticket.id] ?? ticket.price)}
                      onChange={(e) => handlePriceChange(ticket.id, e.target.value)}
                      className="w-full bg-[#f6f6f6] border-none rounded-2xl p-4 text-[#2d2f2f] font-bold text-xl focus:ring-2 focus:ring-[#755700] outline-none transition-all shadow-inner"
                    />
                  </div>

                  {feedback?.id === ticket.id && (
                    <div className={`text-sm font-medium p-3 rounded-xl ${
                      feedback.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-[#fff0f1] text-[#b5161e]"
                    }`}>
                      {feedback.message}
                    </div>
                  )}

                  <button
                    onClick={() => handleSave(ticket.id)}
                    disabled={updatingId === ticket.id || (editPrices[ticket.id] ?? ticket.price) === ticket.price || (editPrices[ticket.id] ?? 0) <= 0}
                    className="w-full mt-4 bg-[#005caa] text-white rounded-2xl py-4 font-bold hover:bg-[#004a8c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_10px_30px_rgba(0,92,170,0.2)]"
                  >
                    {updatingId === ticket.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5 ml-2" />
                        حفظ التعديلات
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-[#2d2f2f] opacity-40 mt-2">
                    آخر تحديث: {new Date(ticket.updatedAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
