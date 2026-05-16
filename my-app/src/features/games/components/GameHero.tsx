"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import Image from "next/image";

interface GameHeroProps {
  attraction: Attraction;
  locale: string;
}

export function GameHero({ attraction, locale }: GameHeroProps) {
  const name = locale === 'ar' ? (attraction as any).name_ar : (attraction as any).name_en;
  const description = locale === 'ar' ? (attraction as any).description_ar : (attraction as any).description_en;
  
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={attraction.image || '/placeholder.jpg'}
          alt={name || 'Game Image'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 px-4 pb-12 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Title and Category */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1"
          >
            {attraction.category && (
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-white uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {attraction.category}
              </span>
            )}
            <h1 className="text-5xl font-black text-white uppercase md:text-7xl drop-shadow-lg">
              {name}
            </h1>
            <p className="max-w-2xl mt-4 text-lg text-white/90 drop-shadow-md">
              {description}
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col items-center px-6 border-e border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Wait Time</span>
              <span className="text-2xl font-bold text-white whitespace-nowrap">{attraction.waitingTime || '--'}</span>
            </div>
            <div className="flex flex-col items-center px-6">
              <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Min Height</span>
              <span className="text-2xl font-bold text-red-500 whitespace-nowrap">{attraction.minHeight || '--'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
