"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";

interface BookingPanelProps {
  attraction: Attraction;
  locale: string;
}

export function BookingPanel({ attraction, locale }: BookingPanelProps) {
  const isSoldOut = attraction.status !== 'Operating';
  
  const statusColors: Record<string, string> = {
    'Operating': 'text-emerald-600',
    'Maintenance': 'text-amber-600',
    'Closed': 'text-[#b5161e]'
  };

  const statusLabels: Record<string, Record<string, string>> = {
    'Operating': { en: 'Available', ar: 'متاح' },
    'Maintenance': { en: 'Maintenance', ar: 'صيانة' },
    'Closed': { en: 'Closed', ar: 'مغلق' }
  };

  const statusText = statusLabels[attraction.status]?.[locale] || attraction.status;
  const statusColorClass = statusColors[attraction.status] || 'text-[#2d2f2f]';

  const headingText = locale === 'ar' ? 'هل أنت مستعد للمغامرة؟' : 'Ready for the adventure?';
  const subText = locale === 'ar' 
    ? 'احجز مكانك واستمتع بتجربة لا تُنسى.' 
    : 'Secure your spot and enjoy an unforgettable experience.';

  const buttonText = locale === 'ar' 
    ? (isSoldOut ? 'غير متاح' : 'احجز الآن') 
    : (isSoldOut ? 'UNAVAILABLE' : 'RESERVE NOW');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto p-8 rounded-[2rem] bg-white border border-neutral-100 shadow-xl shadow-[#2d2f2f]/3 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${statusColorClass.replace('text', 'bg')}`} />
            <span className={`text-sm font-black uppercase tracking-widest ${statusColorClass}`}>
              {statusText}
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#2d2f2f] mb-3">{headingText}</h2>
          <p className="text-neutral-500 text-lg">{subText}</p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          {attraction.isFastTrack && (
            <div className="flex gap-4">
              <div className="flex-1 md:w-48 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col items-center justify-center">
                <span className="text-[11px] uppercase tracking-widest text-[#b5161e] mb-1 font-bold">FastPass Included</span>
                <span className="text-sm font-medium text-neutral-600 text-center">Skip the lines</span>
              </div>
            </div>
          )}

          <button
            disabled={isSoldOut}
            className={`w-full py-5 px-10 rounded-2xl font-black text-lg transition-all duration-300 tracking-wider ${
              isSoldOut
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200/50"
                : "bg-gradient-to-r from-[#b5161e] to-red-500 text-white hover:from-red-500 hover:to-[#b5161e] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
}
