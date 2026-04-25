'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { StepIndicator } from './StepIndicator';
import { PassCard } from './PassCard';
import { TICKET_TIERS } from '../lib/ticket-data';

import 'swiper/css';
import 'swiper/css/pagination';

import { motion } from 'framer-motion';

export function TicketsSection() {
  const t = useTranslations('Tickets');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const handleSelect = (id: string) => {
    console.log('Selected tier:', id);
    // Logic for Step 02 would go here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="w-full py-24 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <StepIndicator />

        {/* Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TICKET_TIERS.map((tier) => (
            <motion.div key={tier.id} variants={itemVariants}>
              <PassCard
                tier={tier}
                onSelect={handleSelect}
                isRtl={isRtl}
              />
            </motion.div>
          ))}
        </motion.div>


      </div>

    </section>
  );
}
