"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import { getTheme } from "@/src/features/games/lib/theme";
import { Sparkles, Ticket } from "lucide-react";
import { BOOKING_URL } from "../lib/constants";
import { useTranslations } from "next-intl";

interface ZooBookingBannerProps {
  attraction: Attraction;
  locale: string;
}

export function ZooBookingBanner({ attraction, locale }: ZooBookingBannerProps) {
  const isRtl = locale === "ar";
  const isSoldOut = attraction.status !== "Operating";
  const theme = getTheme(attraction.layout?.customStyle);
  const t = useTranslations("ZooAnimal.booking");

  const isZoo = attraction.pageKey === "zoo";
  const parkName = isRtl
    ? (isZoo ? "دريم زو" : "دريم بارك")
    : (isZoo ? "Dream Zoo" : "Dream Park");

  const statusColors: Record<string, string> = {
    Operating: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    Maintenance: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    Closed: "text-red-600 dark:text-red-400 bg-red-500/10",
  };

  const statusTextMap: Record<string, string> = {
    Operating: t("statusAvailable"),
    Maintenance: t("statusMaintenance"),
    Closed: t("statusClosed"),
  };

  const statusText = statusTextMap[attraction.status] || attraction.status;
  const statusColorClass = statusColors[attraction.status] || "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto p-10 md:p-14 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-neutral-100/10 dark:border-white/5 shadow-ambient relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-between relative z-10">
        
        {/* Banner Details */}
        <div className={`flex-1 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-3 mb-6 justify-start">
            <span className={`w-3 h-3 rounded-full animate-pulse ${isSoldOut ? "bg-red-500" : "bg-emerald-500"}`} />
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${statusColorClass}`}>
              {statusText}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2d2f2f] dark:text-white mb-5 leading-tight tracking-tight">
            {t("heading")}
          </h2>
          <p className="text-neutral-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
            {t("subtext", { park: parkName })}
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col gap-5 w-full lg:w-auto min-w-[320px] justify-center">
          {attraction.isFastTrack && (
            <div className={`p-6 rounded-3xl bg-[#f0f1f1] dark:bg-zinc-950/60 border border-transparent dark:border-white/5 flex items-center gap-4 ${
              isRtl ? "text-right" : "text-left"
            }`}>
              <div className={`p-3 rounded-2xl ${theme.bgAccent} ${theme.textAccent}`}>
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#2d2f2f] dark:text-white uppercase tracking-wider mb-1">
                  {isRtl ? "يشمل الدخول السريع" : "FastPass Included"}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-normal">
                  {isRtl ? "تجاوز طوابير الانتظار الطويلة" : "Skip the waiting lines"}
                </p>
              </div>
            </div>
          )}

          {isSoldOut ? (
            <button
              disabled
              className="w-full py-5 px-8 rounded-full font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-zinc-500 border border-neutral-200/50 dark:border-white/5 cursor-not-allowed"
            >
              <Ticket size={18} />
              <span>{t("unavailable")}</span>
            </button>
          ) : (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-5 px-8 rounded-full font-black text-sm transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-3 shadow-ambient text-white bg-gradient-to-r ${theme.buttonGrad} hover:scale-[1.03] active:scale-[0.97]`}
            >
              <Ticket size={18} />
              <span>{t("cta")}</span>
            </a>
          )}
        </div>
      </div>

      {/* Decorative Blur Glows */}
      <div className={`absolute -top-32 -right-32 w-80 h-80 ${theme.glowColor} rounded-full blur-[120px] pointer-events-none opacity-40`} />
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 ${theme.glowColor} rounded-full blur-[120px] pointer-events-none opacity-40`} />
    </motion.div>
  );
}
