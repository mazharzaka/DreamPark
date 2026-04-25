'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function LocalePersistence() {
  const locale = useLocale();

  useEffect(() => {
    // Save current locale to localStorage
    localStorage.setItem('NEXT_LOCALE', locale);
    
    // Also ensure the cookie is set (though next-intl handles this)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale]);

  return null;
}
