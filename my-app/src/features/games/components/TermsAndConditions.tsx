"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import { getTheme } from "../lib/theme";
import { 
  ArrowUpFromLine, 
  HeartPulse, 
  Briefcase, 
  ShieldAlert,
  AlertCircle
} from "lucide-react";

interface TermsAndConditionsProps {
  attraction: Attraction;
  locale: string;
}

const iconMap: Record<string, any> = {
  'height': ArrowUpFromLine,
  'health': HeartPulse,
  'items': Briefcase,
  'behavior': ShieldAlert,
};

export function TermsAndConditions({ attraction, locale }: TermsAndConditionsProps) {
  const isRtl = locale === 'ar';
  const rules = attraction.tags?.rules || [];
  const theme = getTheme(attraction.layout?.customStyle);
  
  if (rules.length === 0) return null;

  const sectionTitle = isRtl ? 'الشروط والأحكام والسلامة' : 'Terms & Safety Rules';
  const sectionSubtitle = isRtl 
    ? 'يرجى قراءة إرشادات السلامة بعناية لضمان تجربة ممتعة وآمنة للجميع.'
    : 'Please read the safety guidelines carefully to ensure a fun and secure experience for everyone.';

  return (
    <section className="w-full max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-neutral-100/10 p-8 md:p-12 shadow-ambient relative overflow-hidden"
      >
        {/* Header Block */}
        <div className={`flex items-center gap-4 mb-10 pb-6 border-b border-neutral-100/50 dark:border-zinc-800 relative z-10 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`p-3.5 rounded-2xl ${theme.bgAccent} ${theme.textAccent}`}>
            <AlertCircle size={28} />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl md:text-3xl font-black text-[#2d2f2f] tracking-wide">
              {sectionTitle}
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm mt-1">{sectionSubtitle}</p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {rules.map((rule, index) => {
            const Icon = rule.type && iconMap[rule.type] ? iconMap[rule.type] : AlertCircle;
            const displayText = rule.text || "";
            
            return (
              <motion.div
                key={rule._id || index}
                initial={{ opacity: 0, x: isRtl ? 25 : -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`flex items-start gap-4 p-5 rounded-3xl bg-[#f0f1f1] hover:bg-[#e6e8e8] transition-colors border border-transparent ${theme.borderHover} group`}
              >
                <div className={`p-3 rounded-xl ${theme.bgAccent} ${theme.textAccent} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <p className={`text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base pt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {displayText}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Soft Background Accent Glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${theme.glowColor} rounded-full blur-[100px] pointer-events-none`} />
      </motion.div>
    </section>
  );
}
