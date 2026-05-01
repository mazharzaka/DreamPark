'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { useHeroData } from '../hooks/useHeroData';
import { SlideContent } from './SlideContent';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import '../styles/slider.css';

import { useLocale } from 'next-intl';

interface Slides {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  _id: string;
  imageUrl: string;
}

export function HeroSlider({ slides, isLoading }: { slides: Slides[], isLoading: boolean }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (isLoading) {
    return (
      <div className="w-full h-screen mt-[106px] bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden group">
      <Swiper
        key={locale} // Re-mount swiper on locale change to ensure RTL mode resets correctly
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        dir={isRtl ? 'rtl' : 'ltr'}
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          nextEl: '.slider-nav-next',
          prevEl: '.slider-nav-prev',
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            {({ isActive }) => (
              <SlideContent slide={slide} isActive={isActive} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Flipped for RTL */}
      {/* <button className={`slider-nav-btn hidden md:flex items-center justify-center slider-nav-prev`}>
        <ChevronLeft size={24} />
      </button>
      <button className={`slider-nav-btn hidden md:flex items-center justify-center slider-nav-next`}>
        <ChevronRight size={24} />
      </button> */}
    </section>
  );
}
