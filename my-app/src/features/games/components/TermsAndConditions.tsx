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
  // If no safety rules exist, don't render the section at all
  const rules = attraction.tags?.rules || [];
  
  if (rules.length === 0) return null;

  const sectionTitle = locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions';

  return (
    <section className="w-full max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-[2rem] border border-neutral-100 p-8 md:p-12 shadow-xl shadow-[#2d2f2f]/3 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-neutral-100 pb-6 relative z-10">
          <div className="p-3 bg-[#005caa]/10 text-[#005caa] rounded-xl">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#2d2f2f] tracking-wide">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {rules.map((rule, index) => {
            const Icon = rule.type && iconMap[rule.type] ? iconMap[rule.type] : AlertCircle;
            const displayText = rule.text || "";
            
            return (
              <motion.div
                key={rule._id || index}
                initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#f0f1f1] hover:bg-[#e6e8e8] transition-colors border border-transparent group"
              >
                <div className="p-2.5 rounded-lg bg-[#005caa]/10 text-[#005caa] group-hover:scale-110 transition-transform flex-shrink-0">
                  <Icon size={20} />
                </div>
                <p className="text-neutral-700 leading-relaxed text-sm md:text-base pt-1">
                  {displayText}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Subtle background gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      </motion.div>
    </section>
  );
}
