'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Diamond, Star, Ticket, Check } from 'lucide-react';
import { TicketProduct } from '../lib/ticket-data';

const ICON_MAP = {
  Diamond,
  Star,
  Ticket,
};

interface PassCardProps {
  tier: TicketProduct;
  onSelect: (id: string) => void;
  isRtl: boolean;
}

export function PassCard({ tier, onSelect, isRtl }: PassCardProps) {
  const t = useTranslations('Tickets');

  const isPopular = tier.name.toLowerCase().includes('gold') || (tier.nameAr && tier.nameAr.includes('ذهب'));
  const color = isPopular ? '#d4af37' : '#005caa';
  const name = isRtl ? (tier.nameAr || tier.name) : tier.name;
  const description = isRtl ? (tier.descriptionAr || tier.description) : tier.description;

  // Split description by newlines or dashes if they exist, otherwise it's just one feature
  const features = description ? description.split(/\n|-/).filter(f => f.trim().length > 0) : [];

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative w-full max-w-[480px] rounded-[40px] p-10 flex flex-col items-center bg-white shadow-ambient border-2 border-transparent transition-all duration-300 hover:border-primary/10 overflow-hidden ${isPopular ? 'scale-105 z-10' : ''}`}
    >
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#755700] text-white text-[10px] font-bold uppercase tracking-widest rounded-b-2xl">
          {t('mostPopular')}
        </div>
      )}

      {/* Name & Price */}
      <div className={`w-full mb-8 mt-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h3 className={`text-4xl font-black text-primary mb-6 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
          {name}
        </h3>
        <div className={`flex items-baseline gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span className="text-5xl font-black text-primary">{tier.price} {t('egp')}</span>
          <span className="text-primary/40 text-sm font-bold lowercase">/ {t('person')}</span>
        </div>
      </div>

      {/* Features */}
      <div className="w-full space-y-5 mb-12">
        {features.map((feature, index) => (
          <div key={index} className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: color, color: 'white' }}
            >
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-primary/70 text-sm font-medium">
              {feature.trim()}
            </span>
          </div>
        ))}
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(tier.id)}
        className="w-full py-5 rounded-[24px] text-white font-bold uppercase tracking-widest text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-primary/10"
        style={{ backgroundColor: color }}
      >
        {t('cta')}
      </button>

      {/* Decorative Connectors (as seen in image) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-l-full" />
    </motion.div>
  );
}
