import { useGetHeroByPageQuery } from '@/src/lib/features/api/apiSlice';
import { HeroSlide } from '../types';
import { MOCK_HERO_SLIDES } from '../data/mockHeroSlides';

export function useHeroData() {
  const { data, isLoading } = useGetHeroByPageQuery('home');

  // If data is returned successfully and has content, use it.
  // Otherwise, fall back to MOCK_HERO_SLIDES to prevent UI breaking.
  const slides: HeroSlide[] = data?.success && Array.isArray(data?.data) && data.data.length > 0
    ? data.data
    : MOCK_HERO_SLIDES;

  return { slides, isLoading };
}
