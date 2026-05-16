"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dp_splash_shown";

/**
 * Returns `true` if the splash screen should be shown.
 * It is shown only once per browser session (tab).
 */
export function useSplashScreen(): {
  showSplash: boolean;
  hideSplash: () => void;
} {
  // Default to `false` to avoid a flash; we'll determine server-safely on mount.
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadyShown) {
      setShowSplash(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  const hideSplash = () => setShowSplash(false);

  return { showSplash, hideSplash };
}
