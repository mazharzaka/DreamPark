"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCreateBookingMutation, useGetTicketTypesQuery } from "@/src/lib/features/api/bookingsApi";

export default function MagicPassPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);

  // RTK Query hooks
  const { data: typesRes, isLoading: typesLoading } = useGetTicketTypesQuery();
  const [createBooking, { isLoading: booking, error: bookingError }] = useCreateBookingMutation();

  const ticketTypes = typesRes?.data ?? [];

  // Auto-select first ticket type once loaded
  useEffect(() => {
    if (ticketTypes.length > 0 && !selectedType) {
      setSelectedType(ticketTypes[0].id);
    }
  }, [ticketTypes, selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createBooking({ ticketTypeId: selectedType, targetDate, quantity }).unwrap();
      setQrCodeId(res.data.qrCodeId);
    } catch {
      // error handled via bookingError below
    }
  };

  const selectedTicket = ticketTypes.find((t) => t.id === selectedType);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  // Extract error message from RTK error shape
  const errorMessage = bookingError
    ? "error" in bookingError
      ? (bookingError as any).data?.error ?? "Something went wrong."
      : "Something went wrong."
    : null;

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center mt-22 justify-center p-6 rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-[0_40px_100px_rgba(45,47,47,0.06)] backdrop-blur-[20px]"
      >
        <h1 className="text-[#005caa] text-4xl font-extrabold mb-8 text-center font-['Plus_Jakarta_Sans']">
          احجز ماجيك باس
        </h1>

        {qrCodeId ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(45,47,47,0.04)]">
              <QRCodeSVG value={qrCodeId} size={200} />
            </div>
            <p className="text-center text-lg text-[#2d2f2f] font-medium leading-relaxed bg-[#f6f6f6] p-6 rounded-2xl">
              يرجى التوجه لمكتب التسويق بالحديقة يوم{" "}
              <span className="font-bold text-[#b5161e]">{targetDate}</span>{" "}
              لتأكيد الحجز والدفع نقداً واستلام التذاكر والكوبونات.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2d2f2f] font-semibold mb-2">نوع التذكرة</label>
              {typesLoading ? (
                <div className="w-full h-14 bg-[#f6f6f6] rounded-2xl animate-pulse" />
              ) : (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#f6f6f6] border-none rounded-2xl p-4 text-[#2d2f2f] focus:ring-2 focus:ring-[#005caa] outline-none transition-all shadow-inner"
                >
                  {ticketTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.price} جنيه
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[#2d2f2f] font-semibold mb-2">تاريخ الزيارة</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#f6f6f6] border-none rounded-2xl p-4 text-[#2d2f2f] focus:ring-2 focus:ring-[#005caa] outline-none transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[#2d2f2f] font-semibold mb-2">الكمية</label>
              <div className="flex items-center space-x-4 space-x-reverse bg-[#f6f6f6] rounded-2xl p-2 w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#005caa] font-bold text-xl flex items-center justify-center hover:bg-[#e0e7ff] transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-[#005caa] shadow-sm text-white font-bold text-xl flex items-center justify-center hover:bg-[#004a8c] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t border-[#f6f6f6]">
              <div className="flex justify-between items-center text-xl">
                <span className="font-semibold text-[#2d2f2f]">الإجمالي:</span>
                <span className="font-extrabold text-[#755700]">{totalPrice} جنيه</span>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-[#fff0f1] text-[#b5161e] p-4 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={booking || !targetDate || !selectedType}
              className="w-full bg-[#b5161e] text-white rounded-full py-4 text-lg font-bold hover:bg-[#9a1219] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_10px_30px_rgba(181,22,30,0.2)]"
            >
              {booking ? <Loader2 className="animate-spin mr-2" /> : "تأكيد الحجز"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
