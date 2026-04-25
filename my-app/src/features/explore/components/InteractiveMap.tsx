'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Rocket, Camera, Waves, Star, X, MapPin } from 'lucide-react';
import { MAP_LOCATIONS, MapLocation } from '../lib/map-data';
import { Link } from '@/src/i18n/routing';

const ICON_MAP: Record<string, any> = {
  Rocket,
  Camera,
  Waves,
  Star,
};

export function InteractiveMap() {
  const t = useTranslations('Explore');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedLocation = selectedId
    ? MAP_LOCATIONS.find(l => l.id === selectedId) ?? null
    : null;

  const handleMarkerClick = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className={`mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h2 className={`text-5xl md:text-6xl font-black text-primary tracking-tight mb-4 antialiased ${isRtl ? 'font-cairo' : 'font-sans'}`}>
          {t.rich('title', {
            span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
          })}
        </h2>
        <p className={`text-lg text-primary/70 max-w-2xl leading-relaxed ${isRtl ? 'font-cairo' : ''}`}>
          {t('description')}
        </p>
      </div>

      {/* Map Canvas Wrapper (Horizontal Scroll on Mobile) */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide rounded-[40px] shadow-ambient">
        <div className="relative min-w-[1000px] h-[700px] bg-surface rounded-[40px] overflow-hidden border-8 border-white group">

          {/* Background Illustration */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: 'url("/explore-map-bg1.png")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent mix-blend-overlay" />

          {/* Markers */}
          {MAP_LOCATIONS.map((loc) => {
            const Icon = ICON_MAP[loc.icon] || MapPin;
            const isSelected = selectedId === loc.id;

            return (
              <div
                key={loc.id}
                className="absolute z-20"
                style={{ top: `${loc.y}%`, left: `${loc.x}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ambient Glow */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isSelected ? 1.4 : [1, 1.2, 1],
                      opacity: isSelected ? 0.6 : 0.3
                    }}
                    transition={{
                      repeat: isSelected ? 0 : Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                    className="absolute w-16 h-16 rounded-full blur-[20px]"
                    style={{ backgroundColor: loc.color }}
                  />

                  {/* Marker Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleMarkerClick(loc.id)}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300"
                    style={{ backgroundColor: loc.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            );
          })}

          {/* Detail Panel (Phase 4) */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute top-0 right-0 h-full w-[400px] z-40 glassmorphism p-10 flex flex-col shadow-ambient`}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-surface-container-low"
                >
                  <X size={24} />
                </button>

                <div className="mt-12 flex-1">
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6"
                    style={{ backgroundColor: selectedLocation.color }}
                  >
                    {t(`categories.${selectedLocation.category}`)}
                  </span>

                  <h3 className={`text-4xl font-black text-primary leading-tight mb-4 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
                    {selectedLocation.name}
                  </h3>

                  <p className={`text-primary/70 leading-relaxed mb-10 ${isRtl ? 'font-cairo' : ''}`}>
                    {selectedLocation.desc}
                  </p>
                </div>

                <Link
                  href={`/attractions/${selectedLocation.id}`}
                  className="w-full py-5 bg-gradient-to-r from-primary to-[#ff766d] text-white rounded-full font-bold text-center uppercase tracking-widest text-sm shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('cta')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
