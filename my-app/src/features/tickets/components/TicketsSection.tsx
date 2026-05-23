'use client';

import { useTranslations, useLocale } from 'next-intl';

import { PassCard } from './PassCard';
import { TicketProduct } from '../lib/ticket-data';

import { Link } from '@/src/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Loader2 } from 'lucide-react';

export function TicketsSection({ typesRes, typesLoading, typesError }: { typesRes: any, typesLoading: boolean, typesError: any }) {
  const t = useTranslations('Tickets');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const handleSelect = (id: string) => {
    console.log('Selected tier:', id);
    // Logic for Step 02 would go here
  };

  if (typesLoading) return <Loader2 className="w-12 h-12 text-[#005caa] animate-spin" />;
  if (typesError) return <div className="text-red-500 text-center">Error fetching ticket types</div>;
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
        <div className=" flex  justify-between w-full items-center mb-12">
          <h2 className={`text-5xl md:text-6xl text-start font-black text-primary tracking-tight mb-4 antialiased ${locale === 'ar' ? 'font-cairo' : 'font-sans'}`}>
            {t.rich('title', {
              span: (chunks) => <span className="text-secondary italic font-bold">{chunks}</span>
            })
            }
          </h2>

          <div className="flex flex-col items-end gap-4 p-2" >
            <button className="flex items-center gap-2 bg-[#e9f0f6] text-[#2d5f8b] px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#d4e1ee] transition-colors uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              {t('validity')}
            </button>
            <Link
              href={`/tickets`}
              className="flex items-center gap-2  text-primary hover:text-primary/80 text-xs font-bold  transition-colors uppercase tracking-wide"
            >
              {t('viewAll')}
              {locale === 'ar' ? <ArrowLeft className="w-3.5 h-3.5 text-primary" /> : <ArrowRight className="w-3.5 h-3.5 text-primary" />
              }
            </Link>
          </div>
        </div>

        {/* Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {typesRes?.map((tier: TicketProduct) => (
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
