"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import Image from "next/image";
import { Clock, Compass, HelpCircle } from "lucide-react";
import { getTheme } from "../lib/theme";
import { getOptimizedCloudinaryHeroUrl } from "@/src/lib/cloudinary";

interface GameHeroProps {
  attraction: Attraction;
  locale: string;
}

export function GameHero({ attraction, locale }: GameHeroProps) {
  const isRtl = locale === "ar";
  const name = isRtl ? (attraction as any).name_ar : (attraction as any).name_en;
  const description = isRtl
    ? (attraction as any).description_ar
    : (attraction as any).description_en;

  const theme = getTheme(attraction.layout?.customStyle);

  const waitTimeLabel = isRtl ? "وقت الانتظار" : "Wait Time";
  const minHeightLabel = isRtl ? "الحد الأدنى للطول" : "Min Height";

  return (
    <section className="relative w-full h-[85vh] min-h-[650px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getOptimizedCloudinaryHeroUrl(attraction.image || "/placeholder.jpg")}
          alt={name || "Game Image"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dynamic Theme Color Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${theme.gradientBg} z-10`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10" />
      </div>

      {/* Floating Dynamic Accent Background Glow */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 ${theme.glowColor} rounded-full blur-[160px] pointer-events-none z-10`}
      />

      <div className="container relative z-20 px-6 pb-16 mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Main Title Block */}
          <div className="flex-1 text-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {attraction.category && (
                <span
                  className={`inline-block px-5 py-2 text-xs font-black tracking-widest uppercase rounded-full ${theme.badgeStyle} backdrop-blur-md border border-white/10`}
                >
                  {attraction.category}
                </span>
              )}
              {attraction.isFastTrack && (
                <span className="inline-block px-5 py-2 text-xs font-black tracking-widest text-[#b5161e] bg-red-500/10 rounded-full border border-red-500/10 uppercase">
                  {isRtl ? "المسار السريع" : "FastPass"}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className={`text-5xl font-black text-white uppercase md:text-7xl lg:text-8xl drop-shadow-xl leading-none tracking-tight ${
                isRtl ? "font-cairo" : "font-sans"
              }`}
            >
              {name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="max-w-3xl mt-6 text-lg md:text-xl text-white/80 leading-relaxed font-medium drop-shadow-md"
            >
              {description}
            </motion.p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              delay: 0.3,
            }}
            className="flex gap-4 p-6 rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-white/20 shadow-ambient self-start lg:self-end w-full sm:w-auto"
          >
            {/* Wait Time */}
            <div className="flex-1 sm:flex-initial flex items-center gap-4 px-6 border-e border-neutral-200/50">
              <div className={`p-3 rounded-2xl ${theme.bgAccent} ${theme.textAccent}`}>
                <Clock size={22} className="animate-pulse" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  {waitTimeLabel}
                </span>
                <span className="text-xl font-black text-[#2d2f2f] whitespace-nowrap">
                  {attraction.waitingTime || (isRtl ? "-- دقيقة" : "-- MIN")}
                </span>
              </div>
            </div>

            {/* Min Height */}
            <div className="flex-1 sm:flex-initial flex items-center gap-4 px-6">
              <div className="p-3 rounded-2xl bg-red-500/10 text-[#b5161e]">
                <Compass size={22} />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  {minHeightLabel}
                </span>
                <span className="text-xl font-black text-[#b5161e] whitespace-nowrap">
                  {attraction.minHeight || "--"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
