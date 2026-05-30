'use client';
import { useState, useEffect } from 'react';


import { motion } from 'framer-motion';
import { HeroSlide } from '../types';
import { EditorialButton } from '@/src/components/ui/EditorialButton';
import Image from 'next/image';

interface SlideContentProps {
  slide: HeroSlide;
  isActive: boolean;
  isFirst?: boolean;
  isMounted?: boolean;
}

import { useLocale } from 'next-intl';

export function SlideContent({ slide, isActive, isFirst, isMounted }: SlideContentProps) {

  const locale = useLocale();
  const isRtl = locale === 'ar';

  const containerVariants = {
    hidden: { opacity: 0, x: isRtl ? 20 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.19, 1, 0.22, 1] as const, // Ease out expo
      },
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-start text-start ps-8 md:ps-24 lg:ps-32 2xl:ps-[10%]">
      {/* Background Image Optimized */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide?.imageUrl || "/hero-slider/1.png"}
          alt={slide?.title || ""}
          fill
          priority={isFirst}
          quality={100}
          className={`object-cover transition-transform duration-[15000ms] ease-out ${(isActive && isMounted) ? 'scale-100' : 'scale-110'}`}
          sizes="100vw"
        />
        {/* Base dark tint to mask pixelation and noise - lightened */}
        <div className="absolute inset-0 bg-black/10 z-1" />

        {/* Dynamic Gradient for text legibility - Lightened for better visibility of the image */}
        <div className={`absolute inset-0 z-2 bg-gradient-to-b from-black/30 via-transparent to-black/40 lg:bg-gradient-to-${isRtl ? 'l' : 'r'} lg:from-black/70 lg:via-black/30 lg:to-transparent`} />
      </div>

      {/* Content shifted off-center for "Layout Energy" */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl xl:max-w-5xl 2xl:max-w-7xl pt-20"
      >
        {/* {slide.tagline && (
          <motion.span
            variants={itemVariants}
            className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.3em] text-white/80 uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/10"
          >
            {slide.tagline}
          </motion.span>
        )} */}

        <motion.h1
          variants={itemVariants}
          className={`text-4xl ${isRtl ? 'font-cairo' : 'font-sans'} md:text-5xl lg:text-6xl 2xl:text-8xl font-bold text-white leading-[1.1] mb-6 select-none drop-shadow-2xl`}
        >
          {slide.title + " "}
          <span className="ml-3 text-primary drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">{slide.subtitle}</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl 2xl:text-2xl text-white/70 max-w-2xl 2xl:max-w-3xl mb-10 leading-relaxed font-medium"
        >
          {slide.description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-start">
          <EditorialButton variant={"secondary"} className={`${isRtl ? 'font-cairo !text-2xl' : 'font-poppins'}`}>
            {slide.ctaText}
          </EditorialButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
