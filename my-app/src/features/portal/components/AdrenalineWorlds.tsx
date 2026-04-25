'use client';

import { ArrowLeft, ArrowRight, Calendar, Clock, Droplet, Rocket } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Attraction } from '../types';
import { Link } from '@/src/i18n/routing';

function renderAttractionCard(attr: Attraction, locale: string) {
  const isRtl = locale === 'ar';
  const colSpanClass = attr.layout.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1';
  const rowSpanClass = attr.layout.rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1';

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
    <div key={attr.id} className={baseClasses} style={{ minHeight: attr.layout.rowSpan === 2 ? '500px' : '240px' }}>
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

        {attr.layout.customStyle === 'crimson' && (
          <div className="flex flex-col h-full justify-between">
            <div className="flex gap-2">
              {attr.tags?.map((tag, i) => (
                <span key={i} className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${tag.variant === 'white' ? 'bg-white text-black' : tag.variant === 'green' ? 'bg-[#566014] text-white' : 'bg-black text-white'}`}>
                  {tag.label}
                </span>
              ))}
            </div>
            <div>
              <h3 className={`text-4xl font-normal tracking-tight mb-3 uppercase ${isRtl ? 'font-cairo' : 'font-sans'}`}>{attr.title}</h3>
              <div className="flex items-center gap-4 text-xs font-semibold tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="italic uppercase">{attr.waitTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <span className="uppercase">{attr.minHeight}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {attr.layout.customStyle === 'sky' && (
          <div className="flex flex-col h-full justify-center ps-4 lg:ps-10">
            <div className="text-[10px] tracking-[0.2em] uppercase mb-2 text-white/80 font-medium">{attr.category}</div>
            <h3 className={`text-3xl font-medium tracking-wide uppercase mb-5 ${isRtl ? 'font-cairo' : 'font-sans'}`}>{attr.title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold tracking-wider">
              <span>{attr.waitTime}</span>
              {attr.bookPass && (
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2 rounded-full transition-colors border border-white/10 uppercase">
                  BOOK PASS
                </button>
              )}
            </div>
          </div>
        )}

        {attr.layout.customStyle === 'nebula' && (
          <div className="flex flex-col h-full justify-between">
            <Rocket className="w-5 h-5 mb-auto text-white" />
            <div>
              <h3 className={`text-lg font-medium tracking-wide uppercase mb-2 text-white/90 leading-tight ${isRtl ? 'font-cairo' : 'font-sans'}`}>
                {attr.title.split(' ')[0]}<br />{attr.title.split(' ')[1]}
              </h3>
              <div className="text-[10px] text-white/60 uppercase tracking-widest">{attr.waitTime}</div>
            </div>
          </div>
        )}

        {attr.layout.customStyle === 'amazon' && (
          <div className="flex flex-col h-full justify-between">
            <Droplet className="w-5 h-5 mb-auto text-white" />
            <div>
              <h3 className={`text-lg font-medium tracking-wide uppercase mb-2 text-white/90 leading-tight ${isRtl ? 'font-cairo' : 'font-sans'}`}>
                {attr.title.split(' ')[0]}<br />{attr.title.split(' ')[1]}
              </h3>
              <div className="text-[10px] text-white/60 uppercase tracking-widest">{attr.waitTime}</div>
            </div>
          </div>
        )}

        {attr.layout.customStyle === 'phoenix' && (
          <div className="flex flex-col h-full justify-between lg:justify-end">
            <div className="mb-auto">
              <div className="text-[10px] text-[#ffc843] tracking-[0.2em] uppercase mb-1 font-bold">{attr.category}</div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between items-start gap-4">
              <h3 className={`text-3xl font-bold tracking-tight uppercase leading-none ${isRtl ? 'font-cairo' : 'font-sans'}`}>{attr.title}</h3>
              <div className="text-start lg:text-end">
                <div className="text-4xl font-black italic items-baseline flex gap-1 lg:justify-end">
                  {attr.waitTime?.split(' ')[0]}
                  <span className="text-2xl not-italic uppercase font-bold">{attr.waitTime?.split(' ')[1]}</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-white/70">CURRENT WAIT</div>
              </div>
            </div>
          </div>
        )}

        {attr.layout.customStyle === 'midas' && (
          <div className="flex flex-col h-full justify-end pb-2">
            <h3 className={`text-3xl font-normal tracking-tight mb-2 uppercase ${isRtl ? 'font-cairo' : 'font-sans'}`}>{attr.title}</h3>
            <div className="text-xs text-white/80 tracking-wide">{attr.subtitle}</div>
          </div>
        )}

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
        <div className="shrink-0 flex items-center mb-10  justify-end w-full lg:self-end self-start">
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
