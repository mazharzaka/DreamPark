'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Diamond, Star, Ticket, Check } from 'lucide-react';
import { PassTier } from '../lib/ticket-data';

const ICON_MAP = {
  Diamond,
  Star,
  Ticket,
};

interface PassCardProps {
  tier: PassTier;
  onSelect: (id: string) => void;
  isRtl: boolean;
}

export function PassCard({ tier, onSelect, isRtl }: PassCardProps) {
  const t = useTranslations('Tickets');
  const Icon = ICON_MAP[tier.icon];

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative w-full max-w-[480px] rounded-[40px] p-10 flex flex-col items-center bg-white shadow-ambient border-2 border-transparent transition-all duration-300 hover:border-primary/10 overflow-hidden ${tier.isPopular ? 'scale-105 z-10' : ''}`}
    >
      {/* Most Popular Badge */}
      {tier.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#755700] text-white text-[10px] font-bold uppercase tracking-widest rounded-b-2xl">
          {t('mostPopular')}
        </div>
      )}

      {/* Header Icon & Label */}
      <div className="w-full flex justify-between items-start mb-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: tier.color, color: 'white' }}
        >
          <Icon size={28} />
        </div>
        <span
          className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-60"
          style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
        >
          {t(tier.editionKey)}
        </span>
      </div>

      {/* Name & Price */}
      <div className={`w-full mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h3 className={`text-4xl font-black text-primary mb-6 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
          {t(tier.nameKey)}
        </h3>
        <div className={`flex items-baseline gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="text-5xl font-black text-primary">${tier.price}</span>
          <span className="text-primary/40 text-sm font-bold lowercase">/ {t('person')}</span>
        </div>
      </div>

      {/* Features */}
      <div className="w-full space-y-5 mb-12">
        {tier.features.map((featureKey, index) => (
          <div key={index} className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: tier.color, color: 'white' }}
            >
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-primary/70 text-sm font-medium">
              {t(featureKey)}
            </span>
          </div>
        ))}
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(tier.id)}
        className="w-full py-5 rounded-[24px] text-white font-bold uppercase tracking-widest text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-primary/10"
        style={{ backgroundColor: tier.color }}
      >
        {t(`tiers.${tier.id}.cta`)}
      </button>

      {/* Decorative Connectors (as seen in image) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-l-full" />
    </motion.div>
  );
}
