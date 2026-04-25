import React from 'react';
import Image from 'next/image';
import { Link } from '@/src/i18n/routing';

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
        <div className="absolute top-8 left-8 rtl:left-auto rtl:right-8">
          <Link href="/" className="inline-block">
            <div className="text-2xl font-bold text-primary font-cairo">
              Dream<span className="text-secondary">Park</span>
            </div>
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="w-full max-w-md mt-16">
          {children}
        </div>
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
        
        <div className="absolute inset-0 flex items-center justify-center p-24">
          <div className="text-white text-center glassmorphism p-12 rounded-[3rem]">
            <h2 className="text-5xl font-bold font-cairo mb-6 leading-tight">
              Where Dreams <br/> Come True
            </h2>
            <p className="text-xl opacity-90 max-w-md mx-auto">
              Join millions of visitors who have experienced the magic of DreamPark.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
