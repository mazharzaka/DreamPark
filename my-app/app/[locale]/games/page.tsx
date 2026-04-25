'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GamesGrid } from '@/src/features/games/components/GamesGrid';
import { CategoryFilter } from '@/src/features/games/components/CategoryFilter';
import { CATEGORIES, MOCK_GAMES } from '@/src/features/games/data/mockGames';

export default function GamesPage() {
  const t = useTranslations('Games');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredGames = activeCategory === 'all'
    ? MOCK_GAMES
    : MOCK_GAMES.filter(game => game.categoryId === activeCategory);

  return (
    <main className="min-h-screen bg-background pt-30 pb-16">
      <div className="container mx-auto px-4 md:px-8">
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

        <GamesGrid games={filteredGames} />
      </div>
    </main>
  );
}
