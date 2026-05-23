"use client";
 
import React from "react";
import { motion } from "framer-motion";
import BookingFlow from "@/src/components/BookingFlow";
import { useLocale, useTranslations } from "next-intl";

export default function MagicPassPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("pass");

  return (
    <div 
      className="min-h-screen bg-[#f6f6f6] p-4 md:p-8 rtl mt-24 mb-12 flex flex-col items-center" 
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-6xl">
        {/* Editorial Joy Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:text-right rtl:text-right"
        >
          <span className="text-[#755700] text-xs uppercase tracking-widest font-black bg-[#755700]/5 px-5 py-2.5 rounded-full inline-block mb-3">
            {t("instant_ticketing")}
          </span>
          <h1 className="text-secondary text-3xl md:text-5xl font-black mb-3 font-sans leading-tight">
            {t("reserve_title")}
          </h1>
          <p className="text-on-surface/60 max-w-2xl text-sm md:text-base font-semibold leading-relaxed mt-2">
            {t("reserve_subtitle")}
          </p>
        </motion.div>

        {/* 3-Step Interactive Booking Widget */}
        <BookingFlow />
      </div>
    </div>
  );
}
