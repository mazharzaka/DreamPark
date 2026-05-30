'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryFilter } from '@/src/features/games/components/CategoryFilter';
import { CATEGORIES } from '@/src/features/games/data/mockGames';
import { GamesGrid } from '@/src/features/games/components/GamesGrid';
import { useGetAttractionsQuery } from '@/src/lib/features/api/apiSlice';

export default function AnimalsPage() {
  const t = useTranslations('Animals');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: zooData } = useGetAttractionsQuery({
    lang: locale,
    pageKey: 'zoo',
    category: activeCategory !== 'all' ? activeCategory : undefined
  });



  return (
    <main className="min-h-screen bg-background pb-16">
     

      <div className="container mx-auto px-4 md:px-8 pt-8">
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6"
            dangerouslySetInnerHTML={{ __html: t.raw('pageTitle') }}
          />
          <p className="text-lg md:text-xl text-secondary/70 max-w-2xl">
            {t('pageSubtitle')}
          </p>
        </div>

        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <div className="mt-8">
          <GamesGrid attractions={zooData?.data?.items} />
        </div>
      </div>
    </main>
  );
}
