import { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { MOCK_HERO_SLIDES } from '../data/mockHeroSlides';

export function useHeroData() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setSlides(MOCK_HERO_SLIDES);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { slides, isLoading };
}
