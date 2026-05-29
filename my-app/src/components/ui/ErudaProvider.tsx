'use client';

import { useEffect } from 'react';

export default function ErudaProvider() {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    const queryParams = new URLSearchParams(window.location.search);
    const hasErudaQuery = queryParams.has('eruda');
    const erudaValue = queryParams.get('eruda');
    
    // Check localStorage persistence
    const isSavedEnabled = localStorage.getItem('eruda_enabled') === 'true';

    // Enable if:
    // 1. Explicitly enabled via query param `?eruda=true` or `?eruda=1`
    // 2. Or if already saved in localStorage as enabled
    // 3. Or if we are in development mode AND it hasn't been explicitly disabled (e.g., `?eruda=false` or `eruda_enabled === 'false'`)
    const isDev = process.env.NODE_ENV === 'development';
    
    let shouldEnable = false;

    if (hasErudaQuery) {
      if (erudaValue === 'true' || erudaValue === '1') {
        shouldEnable = true;
        localStorage.setItem('eruda_enabled', 'true');
      } else if (erudaValue === 'false' || erudaValue === '0') {
        shouldEnable = false;
        localStorage.setItem('eruda_enabled', 'false');
      }
    } else if (isSavedEnabled) {
      shouldEnable = true;
    } else if (isDev && localStorage.getItem('eruda_enabled') !== 'false') {
      shouldEnable = true;
    }

    if (shouldEnable) {
      // Dynamic import eruda so it doesn't inflate main bundle for normal production paths
      import('eruda')
        .then((erudaModule) => {
          const eruda = erudaModule.default;
          
          // Verify if eruda is already initialized by checking for the container
          const erudaContainer = document.getElementById('eruda');
          if (!erudaContainer) {
            try {
              eruda.init({
                theme: 'dark',
                defaults: {
                  displaySize: 50,
                  theme: 'Dark',
                  activeTab: 'console'
                }
              } as any);
              console.log('🚀 Eruda console initialized successfully.');
            } catch (initErr) {
              console.warn('Eruda initialization warning:', initErr);
            }
          }
        })
        .catch((err) => {
          console.error('Failed to load Eruda package:', err);
        });
    }
  }, []);

  return null;
}
