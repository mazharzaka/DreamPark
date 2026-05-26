"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/lib/hooks";
import { useGetProfileQuery } from "@/src/lib/features/auth/authApi";
import SplashScreen from "@/src/components/ui/SplashScreen";
import { useLocale } from "next-intl";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const locale = useLocale() || "en";
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Run the profile query if not already authenticated to verify server-side session
  const { isLoading, isFetching, isError, isSuccess } = useGetProfileQuery(undefined, {
    skip: isAuthenticated,
  });

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsVerifying(false);
    } else if (isError) {
      // Force a redirect to the login page under the current locale
      router.push(`/${locale}/login`);
    } else if (isSuccess) {
      setIsVerifying(false);
    }
  }, [isAuthenticated, isSuccess, isError, router, locale]);

  // Determine if we should show the splash screen
  const showSplash = isVerifying || isLoading || isFetching;

  if (showSplash) {
    return <SplashScreen isLoading={true} locale={locale} />;
  }

  // Once verification succeeds, safely render children
  return <>{children}</>;
};
