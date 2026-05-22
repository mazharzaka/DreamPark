import { useGetHeroByPageQuery } from '@/src/lib/features/api/apiSlice';
import { HeroSlide } from '../types';
import { MOCK_HERO_SLIDES } from '../data/mockHeroSlides';
import { useLocale } from 'next-intl';

export function useHeroData() {
  const locale = useLocale();
  const { data, isLoading } = useGetHeroByPageQuery({ lang: locale, pageKey: 'home' });

  // If data is returned successfully and has content, use it.
  // Otherwise, fall back to MOCK_HERO_SLIDES to prevent UI breaking.
  const slides: HeroSlide[] = data?.success && Array.isArray(data?.data) && data.data.length > 0
    ? data.data
    : MOCK_HERO_SLIDES;

  return { slides, isLoading };
}
