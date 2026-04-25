'use client';

import { useTranslations } from 'next-intl';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const t = useTranslations();

  return (
    <div className="flex overflow-x-auto gap-3 py-4 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-surface text-secondary/70 hover:bg-surface/80 border border-secondary/10 hover:border-secondary/20'
            }`}
          >
            {t(category.nameKey)}
          </button>
        );
      })}
    </div>
  );
}
