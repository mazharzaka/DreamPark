'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Camera, Heart, Info, Sun, Trees, BookOpen, MapPin } from 'lucide-react';
import { ZOO_FEATURES, ZOO_PINS } from '../data/zooData';
import { Link } from '@/src/i18n/routing';

// Import swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const iconMap: Record<string, any> = {
  Camera,
  Heart,
  Info,
  Sun,
  Trees,
  BookOpen,
};

export function DreamZoo() {
  const t = useTranslations('DreamZoo');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="bg-[#f9f8f4] py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row gap-16 items-center `}>

          {/* Left Side: Content */}
          <div className="flex-1 w-full text-start">
            <h2 className={`text-5xl md:text-6xl font-black text-primary tracking-tight mb-6 antialiased ${isRtl ? 'font-cairo' : 'font-sans'}`}>
              {t.rich('title', {
                span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
              })}
            </h2>
            <p className={`text-lg text-primary/70 mb-10 max-w-xl leading-relaxed ${isRtl ? 'font-cairo' : 'font-sans'}`}>
              {t('description')}
            </p>

            {/* Feature Carousel */}
            <div className="mb-12 w-[300px]">
              <Swiper
                modules={[Autoplay, FreeMode]}
                spaceBetween={20}
                slidesPerView={1}
                dir={isRtl ? 'rtl' : 'ltr'}
                freeMode={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}

                className="zoo-features-swiper"
              >
                {ZOO_FEATURES.map((feature) => {
                  const Icon = iconMap[feature.icon] || Info;
                  return (
                    <SwiperSlide key={feature.id}>
                      <div className="bg-white p-6 rounded-2xl w-[300px] shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className={`text-sm font-bold text-primary mb-1 uppercase tracking-wider ${isRtl ? 'font-cairo' : ''}`}>
                          {t(feature.titleKey)}
                        </h4>
                        <p className={`text-xs text-primary/60 leading-normal ${isRtl ? 'font-cairo' : ''}`}>
                          {t(feature.descriptionKey)}
                        </p>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* CTA */}
            <Link
              href="/zoo"
              className={`inline-flex items-center justify-center px-10 py-4 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-[0.15em] hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/20 ${isRtl ? 'font-cairo' : ''}`}
            >
              {t('cta')}
            </Link>
          </div>

          {/* Right Side: Stylized Visual Container */}
          <div className="flex-1 w-full relative md:block hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-auto md:h-[600px] w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-white group"
            >
              {/* Background Illustration */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("/dream_zoo_bg1.png")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay" />

              {/* Pins */}

            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
