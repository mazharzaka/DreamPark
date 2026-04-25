'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { HeroSlide } from '../types';

export function OurHeroesSlider({ mockHeroes, title = "Portal.OurHeroes" }: { mockHeroes: HeroSlide[], title: string }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations(title);

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2
              className="text-4xl md:text-5xl font-bold text-[#b91c1c] mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            />
            <p className="text-lg text-secondary/70 leading-relaxed font-medium">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex gap-4">
            <button className="heroes-prev-btn w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-[#b91c1c] hover:border-[#b91c1c] hover:text-white transition-all duration-300">
              <ChevronLeft size={20} className={isRtl ? 'rotate-180' : ''} />
            </button>
            <button className="heroes-next-btn w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-[#b91c1c] hover:border-[#b91c1c] hover:text-white transition-all duration-300">
              <ChevronRight size={20} className={isRtl ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>

        <div className="relative overflow-visible">
          <Swiper
            modules={[Autoplay, Navigation]}
            dir={isRtl ? 'rtl' : 'ltr'}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              320: { slidesPerView: 1.2 },
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1440: { slidesPerView: 4.2 },
            }}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.heroes-next-btn',
              prevEl: '.heroes-prev-btn',
            }}
            className="rounded-[2.5rem] overflow-hidden !py-2"
          >
            {mockHeroes?.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden bg-surface group shadow-xl shadow-black/5">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority={slide.id === 'hero-1'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
