"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Attraction } from "@/src/types/attraction";
import { getTheme } from "@/src/features/games/lib/theme";
import {
  getOptimizedCloudinaryUrl,
  getOptimizedCloudinaryHeroUrl,
  getOptimizedCloudinaryThumbnailUrl,
} from "@/src/lib/cloudinary";
import { useTranslations } from "next-intl";

interface ZooGalleryProps {
  attraction: Attraction;
  locale: string;
}

export function ZooGallery({ attraction, locale }: ZooGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const theme = getTheme(attraction.layout?.customStyle);
  const isRtl = locale === "ar";
  const t = useTranslations("ZooAnimal.gallery");

  const allImages = [
    attraction.image,
    ...(attraction.images || [])
  ].filter(Boolean) as string[];

  if (allImages.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex(
      (activeImageIndex - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-12">
      <div className={`mb-10 ${isRtl ? "text-right" : "text-left"}`}>
        <h2 className="text-3xl md:text-4xl font-black text-[#2d2f2f] dark:text-white mb-3 tracking-wide">
          {t("title")}
        </h2>
        <p className="text-neutral-500 dark:text-zinc-400 text-base md:text-lg">{t("subtitle")}</p>
      </div>

      {/* Editorial Grid (First 3 Images) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allImages.slice(0, 3).map((imgUrl, index) => {
          const isLarge = index === 0 && allImages.length > 1;
          const colSpanClass = isLarge ? "md:col-span-2 md:row-span-2" : "md:col-span-1";
          
          return (
            <motion.div
              key={imgUrl}
              onClick={() => setActiveImageIndex(index)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative rounded-[2.5rem] overflow-hidden bg-neutral-100 dark:bg-zinc-900 ${colSpanClass} aspect-[4/3] cursor-pointer group shadow-ambient transition-all duration-500 border border-transparent dark:border-white/5 hover:border-neutral-200/50 dark:hover:border-white/20`}
            >
              <Image
                src={getOptimizedCloudinaryUrl(imgUrl)}
                alt={`${attraction.name_en || "Zoo Animal"} - Gallery ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-full text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 border border-white/10">
                  <Maximize2 size={20} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Thumbnail Rows for subsequent images */}
      {allImages.length > 3 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {allImages.slice(3).map((imgUrl, index) => (
            <motion.div
              key={imgUrl}
              onClick={() => setActiveImageIndex(index + 3)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-100 dark:bg-zinc-900 cursor-pointer group shadow-sm border border-transparent dark:border-white/5 hover:border-neutral-200/50 dark:hover:border-white/20"
            >
              <Image
                src={getOptimizedCloudinaryThumbnailUrl(imgUrl)}
                alt={`${attraction.name_en || "Zoo Animal"} - Gallery ${index + 4}`}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Slider Actions */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={isRtl ? handleNext : handlePrev}
                  className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 cursor-pointer"
                  aria-label={isRtl ? "الصورة السابقة" : "Previous image"}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={isRtl ? handlePrev : handleNext}
                  className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 cursor-pointer"
                  aria-label={isRtl ? "الصورة التالية" : "Next image"}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
            >
              <Image
                src={getOptimizedCloudinaryHeroUrl(allImages[activeImageIndex])}
                alt={`${attraction.name_en || "Zoo Animal"} - Lightbox`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Counter Badge */}
            <div className="absolute bottom-6 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest backdrop-blur-md border border-white/10">
              {activeImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
