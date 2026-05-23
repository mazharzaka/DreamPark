"use client";

import { useParams } from "next/navigation";
import SplashScreen from "@/src/components/ui/SplashScreen";
import { useSplashScreen } from "@/src/hooks/useSplashScreen";

export function SplashScreenWrapper() {
  const { showSplash, hideSplash } = useSplashScreen();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  if (!showSplash) return null;

  return (
    <SplashScreen
      duration={3000}
      locale={locale}
      onFinished={hideSplash}
    />
  );
}
