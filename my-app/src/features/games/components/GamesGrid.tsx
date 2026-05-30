import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Game } from '../types';
import { Product, Attraction } from '@/src/features/portal/types';
import Link from 'next/link';
import { Clock, Compass, Sparkles, ArrowUpRight } from 'lucide-react';

interface GamesGridProps {
  games?: Game[];
  products?: Product[];
  attractions?: Attraction[];
  locale?: string;
}

function AttractionCard({ attr, locale }: { attr: Attraction; locale: string }) {
  const isRtl = locale === 'ar';
  const hasWaitTime = !!attr.waitTime;
  const hasMinHeight = !!attr.minHeight;
  const isOperating = attr.status === 'Operating';

  return (
    <div key={attr._id} className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 dark:border-zinc-800 shadow-xl group flex flex-col justify-end aspect-[4/5] w-full transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
      {/* Background Image */}
      <Image
        src={attr.image}
        alt={attr.title || ''}
        fill
        className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Modern Multi-Layer Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Floating Glassmorphic Badges */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        {/* Wait Time Badge */}
        {hasWaitTime && (
          <div className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-400 border border-white/10 shadow-lg">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>{isRtl ? `انتظار: ${attr.waitTime}` : `${attr.waitTime}`}</span>
          </div>
        )}

        {/* Operating Status Badge */}
        {attr.status && (
          <div className={`ml-auto flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-lg ${
            isOperating 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOperating ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
            <span>{isOperating ? (isRtl ? 'يعمل حالياً' : 'Operating') : (isRtl ? 'مغلق مؤقتاً' : 'Closed')}</span>
          </div>
        )}
      </div>

      {/* Card Content Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end text-white text-start pointer-events-none">
        {attr.category && (
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 mb-1.5 block">
            {attr.category}
          </span>
        )}

        <h3 className={`text-xl font-bold tracking-tight text-white mb-2 leading-snug drop-shadow-md group-hover:text-sky-300 transition-colors duration-300 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
          {attr.title}
        </h3>

        {attr.description && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity duration-300 mb-3">
            {attr.description}
          </p>
        )}

        {/* Secondary Info (e.g. Min Height) */}
        {hasMinHeight && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>{isRtl ? `الطول المطلوب: ${attr.minHeight}` : `Height: ${attr.minHeight}`}</span>
          </div>
        )}

        {/* Decorative CTA Line */}
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-sky-400 mt-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <span>{isRtl ? 'استكشف مغامراتنا' : 'Explore Safari'}</span>
          <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1 group-hover:-translate-y-0.5' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'}`} />
        </div>
      </div>
    </div>
  );
}

function GameCard({ game, locale, t }: { game: Game; locale: string; t: any }) {
  const isRtl = locale === 'ar';
  const title = game.name || (game.titleKey ? t(game.titleKey) : '');
  const description = game.description || (game.descriptionKey ? t(game.descriptionKey) : '');

  return (
    <Link href={`/${locale}/games/${game.id}`} key={game.id} className="group cursor-pointer">
      <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 dark:border-zinc-800 shadow-xl group flex flex-col justify-end aspect-[4/5] w-full transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
        {/* Background Image */}
        <Image
          src={game.image}
          alt={title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Modern Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

        {/* Floating Glassmorphic Badges */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-sky-400 border border-white/10 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{isRtl ? 'مغامرة' : 'Adventure'}</span>
          </div>
        </div>

        {/* Card Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end text-white text-start pointer-events-none">
          <h3 className={`text-xl font-bold tracking-tight text-white mb-2 leading-snug drop-shadow-md group-hover:text-sky-300 transition-colors duration-300 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
            {title}
          </h3>

          {description && (
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity duration-300 mb-3">
              {description}
            </p>
          )}

          {/* Decorative CTA Line */}
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-sky-400 mt-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <span>{isRtl ? 'العب الآن' : 'Play Now'}</span>
            <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1 group-hover:-translate-y-0.5' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const isRtl = locale === 'ar';

  return (
    <div key={product.id} className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 dark:border-zinc-800 shadow-xl group flex flex-col justify-end aspect-[4/5] w-full transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] hover:border-sky-500/30">
      {/* Background Image */}
      <Image
        src={product.image}
        alt={product.title}
        fill
        className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Modern Multi-Layer Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Floating Glassmorphic Badges */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border border-white/10 shadow-lg">
          <span>{isRtl ? 'تذكرة' : 'Ticket'}</span>
        </div>
      </div>

      {/* Card Content Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end text-white text-start pointer-events-none">
        <h3 className={`text-xl font-bold tracking-tight text-white mb-2 leading-snug drop-shadow-md group-hover:text-sky-300 transition-colors duration-300 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
          {product.title}
        </h3>

        {/* Decorative CTA Line */}
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-sky-400 mt-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <span>{isRtl ? 'عرض التذكرة' : 'View Ticket'}</span>
          <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isRtl ? 'group-hover:-translate-x-1 group-hover:-translate-y-0.5' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'}`} />
        </div>
      </div>
    </div>
  );
}

export function GamesGrid({ games, products, attractions, locale: customLocale }: GamesGridProps) {
  const activeLocale = useLocale();
  const locale = customLocale || activeLocale;
  const t = useTranslations();

  const totalItems = (games?.length || 0) + (products?.length || 0) + (attractions?.length || 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-secondary/60">
          {t('Games.noGamesFound') || 'No items found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {/* Render Attraction Cards */}
      {attractions?.map((attr) => (
        <AttractionCard key={attr._id} attr={attr} locale={locale} />
      ))}

      {/* Render Game Cards */}
      {games?.map((game) => (
        <GameCard key={game.id} game={game} locale={locale} t={t} />
      ))}

      {/* Render Product Cards */}
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
