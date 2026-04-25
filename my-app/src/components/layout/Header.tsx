'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import { EditorialButton } from '../ui/EditorialButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export function Header() {
  const t = useTranslations('Navigation');
  const tActions = useTranslations('Actions');

  const navLinks = [
    { label: t('parkInfo'), href: '/park-info', active: true },
    { label: t('attractions'), href: '/attractions' },
    { label: t('dining'), href: '/dining' },
    { label: t('map'), href: '/map' },
  ];

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 w-full">
      <nav className="glassmorphism bg-white px-6 py-3 flex items-center justify-between shadow-ambient border border-white/20">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logoDream.png" alt="Logo" width={80} height={80} />
          <Link href="/" className="text-secondary text-xl md:block hidden pt-2 font-black italic tracking-tighter hover:opacity-80 transition-opacity">
            <span className='text-primary'> Dream</span> Park
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-sm font-bold tracking-wide transition-colors hover:text-primary ${link.active ? 'text-primary' : 'text-on-surface/70'
                }`}
            >
              {link.label}
              {link.active && (
                <motion.div
                  layoutId="header-active-link"
                  className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center flex-col  md:flex-row md:gap-3 gap-1">
          <EditorialButton variant="primary" className="!px-3 !py-1 md:!px-6 md:!py-3 !min-h-0 !min-w-0  md:!text-xs !text-xxs">
            {tActions('bookNow')}
          </EditorialButton>
          <LanguageSwitcher />
        </div>


      </nav>
    </header>
  );
}
