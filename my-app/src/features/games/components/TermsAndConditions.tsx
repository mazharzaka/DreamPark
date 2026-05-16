"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
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
  // If no tags exist, don't render the section at all
  if (!attraction.tags || attraction.tags.length === 0) return null;

  // Filter tags to ensure we only show ones that have text or label
  const rules = attraction.tags.filter(tag => tag.text || tag.label);
  
  if (rules.length === 0) return null;

  const sectionTitle = locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions';

  return (
    <section className="w-full max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0A1122] rounded-[2rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 relative z-10">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {rules.map((rule, index) => {
            const Icon = rule.type && iconMap[rule.type] ? iconMap[rule.type] : AlertCircle;
            const displayText = rule.text || rule.label; // Fallback to label if text isn't available
            
            return (
              <motion.div
                key={rule._id || index}
                initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                  <Icon size={20} />
                </div>
                <p className="text-white/80 leading-relaxed text-sm md:text-base pt-1">
                  {displayText}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Subtle background gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      </motion.div>
    </section>
  );
}
