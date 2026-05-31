'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useGetAttractionsQuery } from '@/src/lib/features/api/apiSlice';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { HeroSlide } from '../types';

export function OurHeroesSlider({ mockHeroes, title = "Portal.OurHeroes" }: { mockHeroes?: HeroSlide[], title: string }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations(title);

  // Hydration safety mount toggle
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const secName = title.toLowerCase();

  // RTK Query fetching - Skipped if mockHeroes are passed directly as props
  const { data: attractionsData, isLoading, error } = useGetAttractionsQuery(
    { lang: locale, pageKey: secName },
    { skip: !!mockHeroes }
  );

  // Resolve slides to render
  let heroes: HeroSlide[] = [];
  if (mockHeroes) {
    heroes = mockHeroes;
  } else if (attractionsData?.data?.items) {
    heroes = attractionsData.data.items.map((item: any) => ({
      id: item._id || item.id,
      title: item.title || item.name || '',
      description: item.description || '',
      image: item.image || ''
    }));
  }

  // Skeletons during hydration mount pending
  if (!mounted) {
    return (
      <section className="py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="w-1/3">
              <div className="h-10 bg-[#f0f1f1] rounded-full animate-pulse mb-4" />
              <div className="h-6 bg-[#f0f1f1] rounded-full w-2/3 animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f0f1f1] animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-[#f0f1f1] animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[350px] md:h-[450px] lg:h-[550px] bg-[#f0f1f1] rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Loading skeleton while RTK Query is fetching
  if (isLoading && !mockHeroes) {
    return (
      <section className="py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="w-1/3">
              <div className="h-10 bg-[#f0f1f1] rounded-full animate-pulse mb-4" />
              <div className="h-6 bg-[#f0f1f1] rounded-full w-2/3 animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f0f1f1] animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-[#f0f1f1] animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[350px] md:h-[450px] lg:h-[550px] bg-[#f0f1f1] rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error fallback UI
  if (error && !mockHeroes) {
    return (
      <section className="py-8 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="py-16 bg-[#f6f6f6] rounded-[2.5rem] max-w-xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              {locale === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading slides'}
            </h3>
            <p className="text-secondary/70 mb-6">{locale === 'ar' ? 'فشل الاتصال بالخادم الرئيسي' : 'Failed to connect to primary backend'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state fallback UI
  if (heroes.length === 0) {
    return null;
  }

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
              {t('subtitle') || t('description') || ''}
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
            {heroes.map((slide) => (
              <SwiperSlide key={slide.id || slide._id}>
                <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden bg-surface group shadow-xl shadow-black/5">
                  <Image
                    src={slide.image || slide.imageUrl || ""}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={slide.id === 'hero-1' || slide._id === 'hero-1'}
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
