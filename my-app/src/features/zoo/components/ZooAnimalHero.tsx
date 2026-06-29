"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import Image from "next/image";
import { Clock } from "lucide-react";
import { getTheme } from "@/src/features/games/lib/theme";
import { getOptimizedCloudinaryHeroUrl } from "@/src/lib/cloudinary";
import { ZooInfoBox } from "./ZooInfoBox";
import { useTranslations } from "next-intl";

interface ZooAnimalHeroProps {
  attraction: Attraction;
  locale: string;
}

export function ZooAnimalHero({ attraction, locale }: ZooAnimalHeroProps) {
  const isRtl = locale === "ar";
  const t = useTranslations("ZooAnimal.hero");

  const primaryName = (isRtl ? attraction.name_ar : attraction.name_en) || attraction.name;
  const secondarySubtitle = isRtl 
    ? (attraction.name_en || attraction.name)?.toUpperCase() 
    : (attraction.name_ar || attraction.name);

  const description = (isRtl ? attraction.description_ar : attraction.description_en) || attraction.description;
  const theme = getTheme(attraction.layout?.customStyle);

  return (
    <section className="relative w-full h-[90vh] min-h-[700px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getOptimizedCloudinaryHeroUrl(attraction.image || "/placeholder.jpg")}
          alt={primaryName || "Zoo Animal"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dynamic Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
      </div>

      {/* Dynamic Glow Accent */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 ${theme.glowColor} rounded-full blur-[160px] pointer-events-none z-10`}
      />

      <div className="container relative z-20 px-6 pb-20 mx-auto w-full">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          
          {/* Hero Content Left/Right */}
          <div className="flex-1 text-start">
            {/* Category Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              {attraction.category && (
                <span className="inline-block px-5 py-2 text-xs font-black tracking-widest uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                  {attraction.category}
                </span>
              )}
            </motion.div>

            {/* Bilingual Titles */}
            <div className="flex flex-col gap-1">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`text-5xl font-black text-white md:text-7xl lg:text-8xl drop-shadow-2xl leading-none tracking-tight ${
                  isRtl ? "font-cairo" : "font-sans"
                }`}
              >
                {primaryName}
              </motion.h1>

              {/* Subtitle */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className={`text-xl font-bold tracking-widest text-white/50 uppercase drop-shadow-md ${
                  isRtl ? "font-sans pl-1.5" : "font-cairo"
                }`}
              >
                {secondarySubtitle}
              </motion.span>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mt-6 text-base md:text-lg text-white/80 leading-relaxed font-medium drop-shadow-md"
            >
              {description}
            </motion.p>

            {/* Anchor the stylized InfoBox */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8"
            >
              <ZooInfoBox />
            </motion.div>
          </div>

          {/* Stat Box (Wait Time) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              delay: 0.3,
            }}
            className="flex gap-4 p-6 rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-white/20 dark:border-zinc-800 shadow-ambient self-start lg:self-end w-full sm:w-auto"
          >
            <div className="flex items-center gap-4 px-6">
              <div className={`p-3 rounded-2xl ${theme.bgAccent} ${theme.textAccent}`}>
                <Clock size={22} className="animate-pulse" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-zinc-400 font-bold">
                  {t("waitTime")}
                </span>
                <span className="text-xl font-black text-[#2d2f2f] dark:text-white whitespace-nowrap">
                  {attraction.waitingTime || `0 ${t("min")}`}
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
