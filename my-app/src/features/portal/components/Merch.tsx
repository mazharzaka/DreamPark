'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { GamesGrid } from '../../games/components/GamesGrid';
import { useGetAttractionsQuery } from '@/src/lib/features/api/apiSlice';

export default function Merch() {
    const t = useTranslations('Merch');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    // Hydration safety mount toggle
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // RTK Query fetching for merch products
    const { data: attractionsData, isLoading, error } = useGetAttractionsQuery({
        lang: locale,
        pageKey: 'merch'
    });

    const merch = attractionsData?.data?.items || [];

    // Hydration / Loading state placeholder
    if (!mounted || isLoading) {
        return (
            <section className="bg-background py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <div className="h-14 bg-[#f0f1f1] rounded-full w-1/2 animate-pulse mb-6" />
                        <div className="h-6 bg-[#f0f1f1] rounded-full w-1/3 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-[#f0f1f1] rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error state placeholder
    if (error) {
        return (
            <section className="bg-background py-16">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <div className="py-16 bg-[#f6f6f6] rounded-[2.5rem] max-w-xl mx-auto px-6">
                        <h3 className="text-2xl font-bold text-red-600 mb-4">
                            {locale === 'ar' ? 'فشل تحميل المنتجات' : 'Failed to load merchandise'}
                        </h3>
                        <p className="text-secondary/70">{locale === 'ar' ? 'فشل الاتصال بالخادم الرئيسي' : 'Failed to connect to primary backend'}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (merch.length === 0) {
        return null;
    }

    return (
        <section className="bg-background py-16">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <h2 className={`text-5xl md:text-6xl font-black text-primary tracking-tight mb-6 antialiased ${isRtl ? 'font-cairo' : 'font-sans'}`}>
                        {t.rich('pageTitle', {
                            span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
                        })}
                    </h2>
                    <p className="text-lg md:text-xl text-secondary/70 max-w-2xl">
                        {t('pageSubtitle')}
                    </p>
                </div>
                <GamesGrid attractions={merch} />
            </div>
        </section>
    );
}
