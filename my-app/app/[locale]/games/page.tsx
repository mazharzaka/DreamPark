'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { CategoryFilter } from '@/src/features/games/components/CategoryFilter';
import { CATEGORIES } from '@/src/features/games/data/mockGames';
import { useGetAttractionsQuery } from '@/src/lib/features/api/apiSlice';
import { Game } from '@/src/features/games/types';

// GamesGrid — dynamically loaded to keep the filter bar interactive immediately
// while the heavier card grid (images + hover animations) loads in the background.
const GamesGrid = dynamic(
  () => import('@/src/features/games/components/GamesGrid').then((mod) => mod.GamesGrid),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-[2rem] bg-gray-100 animate-pulse" />
        ))}
      </div>
    ),
  }
);

export default function GamesPage() {
  const t = useTranslations('Games');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch games from backend
  const {
    data: gamesData,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetAttractionsQuery({
    lang: locale,
    pageKey: 'home',
    category: activeCategory === 'all' ? undefined : activeCategory
  });

  // Local state to store categories so they don't disappear when filtered (Q1)
  const [categories, setCategories] = useState<any[]>([
    { id: 'all', nameKey: 'Games.Categories.all' }
  ]);

  // Extract unique categories from the "all games" initial load response
  useEffect(() => {
    if (activeCategory === 'all' && gamesData?.data?.items) {
      const allCategory = { id: 'all', nameKey: 'Games.Categories.all' };
      const uniqueCategories = Array.from(new Set(
        gamesData.data.items
          .map((item: any) => item.category)
          .filter(Boolean)
      )).map(catName => ({
        id: catName as string,
        nameKey: `Games.Categories.${catName}`
      }));
      setCategories([allCategory, ...uniqueCategories]);
    }
  }, [gamesData, activeCategory]);

  // Map backend items to frontend Game interface
  const games: Game[] = useMemo(() => {
    if (!gamesData?.data?.items) return [];

    return gamesData.data.items.map((item: any) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      image: item.image,
      categoryId: item.category
    }));
  }, [gamesData]);

  // Handle filter error notification (dismissible, preserves previous results per Q2)
  const [filterError, setFilterError] = useState<string | null>(null);

  // Update filterError when isError changes on a background fetch
  useMemo(() => {
    if (isError && gamesData) {
      setFilterError(t('filterError') || 'Failed to filter games. Showing previous results.');
    } else {
      setFilterError(null);
    }
  }, [isError, gamesData, t]);

  // Initial load state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-secondary/60 animate-pulse">{t('loadingGames') || 'Loading Games...'}</p>
        </div>
      </main>
    );
  }

  // Initial error state (Full page per FR-003)
  if (isError && !gamesData) {
    return (
      <main className="min-h-screen bg-background pt-30 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-[2rem] border border-red-500/20 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">{t('errorTitle') || 'Oops! Something went wrong'}</h2>
          <p className="text-secondary/70 mb-8">
            {t('errorDescription') || 'We couldn\'t load the games right now. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform"
          >
            {t('refreshPage') || 'Refresh Page'}
          </button>
        </div>
      </main>
    );
  }

  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-background pt-30 pb-16">
      <div className={`container mx-auto px-4 md:px-8 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6"
            dangerouslySetInnerHTML={{ __html: t.raw('pageTitle') }}
          />
          <p className="text-lg md:text-xl text-secondary/70 max-w-2xl">
            {t('pageSubtitle')}
          </p>
        </div>

        {/* Filter Error Notification (Q2) */}
        {filterError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-500">{filterError}</span>
            </div>
            <button onClick={() => setFilterError(null)} className="text-red-500/50 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Show a subtle loading overlay during category switches */}
        <div className={`relative transition-opacity duration-300 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <GamesGrid games={games} locale={locale} />
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
