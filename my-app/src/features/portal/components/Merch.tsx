'use client';
import { useLocale, useTranslations } from 'next-intl';
import { GamesGrid } from '../../games/components/GamesGrid';
import { mockMerch } from '../../games/data/mockGames';

export default function Merch() {
    const t = useTranslations('Merch');
    const locale = useLocale();
    const isRtl = locale === 'ar';
    return (
        <main className="min-h-screen bg-background pt-30 pb-16">
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
                <GamesGrid products={mockMerch} />
            </div>
        </main>
    );
}
