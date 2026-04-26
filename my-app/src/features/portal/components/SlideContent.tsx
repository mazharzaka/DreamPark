'use client';

import { motion } from 'framer-motion';
import { HeroSlide } from '../types';
import { EditorialButton } from '@/src/components/ui/EditorialButton';
import Image from 'next/image';

interface SlideContentProps {
  slide: HeroSlide;
  isActive: boolean;
}

import { useLocale } from 'next-intl';

export function SlideContent({ slide, isActive }: SlideContentProps) {
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
        ease: [0.19, 1, 0.22, 1], // Ease out expo
      },
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-start text-start ps-8 md:ps-24 lg:ps-32 2xl:ps-[10%]">
      {/* Background Image Optimized */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide?.imageUrl || ""}
          alt={slide.title}
          fill
          priority={isActive}
          className={`object-cover transition-transform duration-[10000ms] ${isActive ? 'scale-100' : 'scale-110'}`}
          sizes="100vw"
        />
        {/* Gradient mirrored for RTL */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 lg:bg-gradient-to-${isRtl ? 'l' : 'r'} lg:from-black/80 lg:via-black/30 lg:to-transparent`} />
        {/* Top/Bottom editorial gradients */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
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
          className={`text-6xl md:text-8xl lg:text-[7rem] 2xl:text-[10rem] font-bold text-white leading-[0.9] mb-8 select-none ${isRtl ? 'font-cairo' : 'font-sans'}`}
        >
          {slide.title + " "}
          <span className="text-primary">{slide.subtitle}</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl 2xl:text-2xl text-white/70 max-w-2xl 2xl:max-w-3xl mb-10 leading-relaxed font-medium"
        >
          {slide.description}
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-start">
          <EditorialButton variant={"secondary"}>
            {slide.ctaText}
          </EditorialButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
