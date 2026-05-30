'use client';

import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Attraction } from '../types';
import { Link } from '@/src/i18n/routing';

function renderAttractionCard(attr: Attraction, locale: string) {
  const isRtl = locale === 'ar';
  const colSpanClass =
    attr.layout.colSpan === 4 ? 'md:col-span-4' :
      attr.layout.colSpan === 3 ? 'md:col-span-3' :
        attr.layout.colSpan === 2 ? 'md:col-span-2' :
          'md:col-span-1';

  const rowSpanClass =
    attr.layout.rowSpan === 4 ? 'md:row-span-4' :
      attr.layout.rowSpan === 3 ? 'md:row-span-3' :
        attr.layout.rowSpan === 2 ? 'md:row-span-2' :
          'md:row-span-1';

  const baseClasses = `relative rounded-3xl overflow-hidden group ${colSpanClass} ${rowSpanClass} shadow-sm`;
  const getFallbackGradient = (style: string) => {
    switch (style) {
      case 'crimson': return 'from-red-900 to-red-600';
      case 'sky': return 'from-[#174685] to-[#1e61b8]';
      case 'nebula': return 'from-[#0b1d3d] to-[#123166]';
      case 'amazon': return 'from-[#0d4a41] to-[#147063]';
      case 'phoenix': return 'from-red-950 via-red-800 to-red-600';
      case 'midas': return 'from-yellow-900 to-[#a37915]';
      default: return 'from-gray-900 to-gray-700';
    }
  };

  return (
    <div key={attr._id} className={baseClasses} style={{ minHeight: attr.layout.rowSpan === 2 ? '500px' : '240px' }}>
      {/* Fallback Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br z-10 opacity-50 ${getFallbackGradient(attr.layout.customStyle!)}`} />

      {/* Background Image */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${attr.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t z-20 from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end text-white text-start">

        <div className="flex flex-col h-full justify-between gap-2">
          {/* Top section: Category & Risk Level */}
          {(attr.category || attr.riskLevel) && (
            <div className="flex justify-between items-start mb-auto">
              {attr.category && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/90 font-bold bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                  {attr.category}
                </span>
              )}
              {attr.riskLevel && (
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md">
                  {attr.riskLevel}
                </span>
              )}
            </div>
          )}

          {/* Bottom section: Title, Description, Height, Price */}
          <div className="mt-auto">
            {attr.title && (
              <h3 className={`text-3xl lg:text-4xl font-bold tracking-tight uppercase mb-2 ${isRtl ? 'font-cairo' : 'font-sans'} drop-shadow-lg`}>
                {attr.title}
              </h3>
            )}
            
            {attr.description && (
              <p className="text-sm text-white/90 line-clamp-2 mb-4 drop-shadow-md font-medium">
                {attr.description}
              </p>
            )}

            {(attr.minHeight || attr.ticketPrice) && (
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-wider mt-3">
                {attr.minHeight && (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    <span className="uppercase">{attr.minHeight}</span>
                  </div>
                )}
                {attr.ticketPrice && (
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 text-[#ffc843]">
                    <span className="uppercase">{attr.ticketPrice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export function AdrenalineWorlds({ attractions, title, link = "games" }: { attractions?: Attraction[], title: string, link?: string }) {
  const t = useTranslations(title);
  const locale = useLocale();

  return (
    <section className="bg-white py-3 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-1 gap-x-12 gap-y-6">
          <div className=" flex  justify-between w-full">
            <h2 className={`text-5xl md:text-6xl text-start font-black text-primary tracking-tight mb-4 antialiased ${locale === 'ar' ? 'font-cairo' : 'font-sans'}`}>
              {title === "DreamZoo" ? t.rich('animals', {
                span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
              }) : t.rich('title', {
                span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
              })}
            </h2>
            <button className="flex items-center gap-2 bg-[#e9f0f6] text-[#2d5f8b] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#d4e1ee] transition-colors uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              {t('openStatus')}
            </button>
          </div>

        </div>
        <div className="shrink-0 flex items-center mb-10 justify-end w-full lg:self-end self-start">
          <Link
            href={`/${link}`}
            className="flex items-center gap-2  text-primary hover:text-primary/80 text-xs font-bold  transition-colors uppercase tracking-wide"
          >
            {t('viewAll')}
            {locale === 'ar' ? <ArrowLeft className="w-3.5 h-3.5 text-primary" /> : <ArrowRight className="w-3.5 h-3.5 text-primary" />
            }
          </Link>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${title === "DreamZoo" ? "md:grid-rows-2" : "md:grid-rows-3"} gap-4`}>
          {attractions?.map((attr) => renderAttractionCard(attr, locale))}
        </div>
      </div>
    </section>
  );
}
