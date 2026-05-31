"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import { getTheme } from "../lib/theme";
import { Sparkles, Calendar, Ticket } from "lucide-react";

interface BookingPanelProps {
  attraction: Attraction;
  locale: string;
}

export function BookingPanel({ attraction, locale }: BookingPanelProps) {
  const isRtl = locale === "ar";
  const isSoldOut = attraction.status !== "Operating";
  const theme = getTheme(attraction.layout?.customStyle);

  const statusColors: Record<string, string> = {
    Operating: "text-emerald-600",
    Maintenance: "text-amber-600",
    Closed: "text-[#b5161e]",
  };

  const statusLabels: Record<string, Record<string, string>> = {
    Operating: { en: "Available Today", ar: "متاح اليوم" },
    Maintenance: { en: "Under Maintenance", ar: "تحت الصيانة" },
    Closed: { en: "Closed Temporarily", ar: "مغلق مؤقتاً" },
  };

  const statusText =
    statusLabels[attraction.status]?.[locale] || attraction.status;
  const statusColorClass = statusColors[attraction.status] || "text-[#2d2f2f]";

  const headingText = isRtl
    ? "هل أنت مستعد للمغامرة؟"
    : "Ready for the adventure?";
  const subText = isRtl
    ? "احجز مكانك واستمتع بتجربة لا تُنسى في دريم بارك."
    : "Secure your spot and enjoy an unforgettable experience at Dream Park.";

  const buttonText = isRtl
    ? isSoldOut
      ? "غير متاح حالياً"
      : "احجز بطاقتك السحرية الآن"
    : isSoldOut
    ? "UNAVAILABLE"
    : "RESERVE MAGIC PASS NOW";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full max-w-4xl mx-auto p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-neutral-100/10 shadow-ambient relative overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
        {/* Left/Right Text Section */}
        <div className={`flex-1 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-3 mb-5 justify-start">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${statusColorClass.replace(
                "text",
                "bg"
              )}`}
            />
            <span
              className={`text-xs font-black uppercase tracking-widest ${statusColorClass}`}
            >
              {statusText}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#2d2f2f] mb-4 leading-tight">
            {headingText}
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">{subText}</p>
        </div>

        {/* Right/Left Action Section */}
        <div className="flex flex-col gap-5 w-full md:w-auto min-w-[280px]">
          {attraction.isFastTrack && (
            <div
              className={`p-5 rounded-2xl bg-[#f0f1f1] hover:bg-[#e6e8e8] transition-colors flex items-center gap-4 ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme.bgAccent} ${theme.textAccent}`}>
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#2d2f2f] uppercase tracking-wider mb-0.5">
                  {isRtl ? "يشمل الدخول السريع" : "FastPass Included"}
                </h4>
                <p className="text-xs text-neutral-500 leading-normal">
                  {isRtl ? "تجاوز طوابير الانتظار الطويلة" : "Skip the waiting lines"}
                </p>
              </div>
            </div>
          )}

          <button
            disabled={isSoldOut}
            className={`w-full py-5 px-8 rounded-full font-black text-sm transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-3 shadow-ambient ${
              isSoldOut
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200/50"
                : `bg-gradient-to-r ${theme.buttonGrad} text-white hover:scale-[1.03] active:scale-[0.97]`
            }`}
          >
            <Ticket size={18} />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>

      {/* Modern Soft Ambient Glows mapped to customStyle */}
      <div
        className={`absolute -top-32 -right-32 w-72 h-72 ${theme.glowColor} rounded-full blur-[100px] pointer-events-none`}
      />
      <div
        className={`absolute -bottom-32 -left-32 w-72 h-72 ${theme.glowColor} rounded-full blur-[100px] pointer-events-none`}
      />
    </motion.div>
  );
}
