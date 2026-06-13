"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const SplashScreen = dynamic(() => import("@/src/components/ui/SplashScreen"), { ssr: false });
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
