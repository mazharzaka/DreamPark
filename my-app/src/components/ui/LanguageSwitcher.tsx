"use client";

import { useLocale } from 'next-intl';
import { useRouter } from '@/src/i18n/routing';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import Image from 'next/image';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        router.push('/', { locale: newLocale });
    }

    return (
        <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
        >
            {locale === 'en' ? <Image src="/flags/egy.png" alt="" width={24} height={24} /> : <Image src="/flags/ukl.png" alt="" width={24} height={24} />}
        </motion.button>
    )
}