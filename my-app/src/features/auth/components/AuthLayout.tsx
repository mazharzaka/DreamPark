import React from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
}

export const AuthLayout = ({ children, imageSrc }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen bg-background flex">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-surface z-10 relative shadow-ambient">
        {/* Logo Link to Home */}

        {/* Main Content */}
        <div className="w-full max-w-md mt-16">{children}</div>
      </div>

      {/* Image Section (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-secondary">
        <Image
          src={imageSrc}
          alt="DreamPark Magic"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />
      </div>
    </main>
  );
};
