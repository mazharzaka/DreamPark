"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Ticket, CheckCircle, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Booking, useGetUserBookingsQuery } from "@/src/lib/features/api/bookingsApi";

export default function BookingsHistoryPage() {
  const { data: bookingsRes, isLoading } = useGetUserBookingsQuery();
  const bookings: Booking[] = bookingsRes?.data ?? [];

  const getStatusBadge = (status: string, targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(targetDate);
    date.setHours(0, 0, 0, 0);

    if (status === "PAID") {
      return (
        <span className="flex items-center text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          <CheckCircle className="w-4 h-4 mr-1 ml-1" /> تم الدفع
        </span>
      );
    } else if (date < today) {
      return (
        <span className="flex items-center text-sm font-bold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4 mr-1 ml-1" /> منتهي الصلاحية
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-sm font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4 mr-1 ml-1" /> قيد الانتظار
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-8 rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-[#005caa] text-4xl font-extrabold mb-2 font-['Plus_Jakarta_Sans']">
            سجل الحجوزات
          </h1>
          <p className="text-[#2d2f2f] opacity-70">استعرض تذاكرك الحالية والسابقة.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#005caa] animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-[0_20px_50px_rgba(45,47,47,0.04)]">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#2d2f2f] mb-2">لا توجد حجوزات</h2>
            <p className="text-[#2d2f2f] opacity-60">لم تقم بإجراء أي حجوزات حتى الآن.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, i) => {
              const date = new Date(booking.targetDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = date < today;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(45,47,47,0.04)] flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-[#2d2f2f] mb-1">
                          {booking.ticketType.name}
                        </h3>
                        <p className="text-[#005caa] font-semibold text-lg">
                          {date.toLocaleDateString("ar-EG", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {getStatusBadge(booking.status, booking.targetDate)}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-[#f6f6f6]">
                      <div className="bg-[#f6f6f6] px-4 py-2 rounded-xl">
                        <span className="block text-xs font-semibold opacity-60 mb-1">الكمية</span>
                        <span className="font-bold text-lg">{booking.quantity}</span>
                      </div>
                      <div className="bg-[#f6f6f6] px-4 py-2 rounded-xl">
                        <span className="block text-xs font-semibold opacity-60 mb-1">الإجمالي</span>
                        <span className="font-extrabold text-[#755700] text-lg">{booking.totalPrice} جنيه</span>
                      </div>
                    </div>
                  </div>

                  {!isPast && booking.status !== "PAID" && (
                    <div className="bg-[#f6f6f6] p-4 rounded-3xl shrink-0 flex flex-col items-center">
                      <QRCodeSVG value={booking.qrCodeId} size={100} />
                      <span className="text-xs font-semibold mt-2 text-[#b5161e]">اعرض هذا الرمز للدفع</span>
                    </div>
                  )}
                  {booking.status === "PAID" && (
                    <div className="bg-emerald-50 text-emerald-600 p-6 rounded-3xl shrink-0 flex flex-col items-center justify-center w-[132px] h-[132px]">
                      <CheckCircle className="w-10 h-10 mb-2" />
                      <span className="text-sm font-bold text-center">مؤكدة</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
