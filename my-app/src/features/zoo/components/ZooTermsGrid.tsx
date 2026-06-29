"use client";

import { motion } from "framer-motion";
import { Attraction } from "@/src/types/attraction";
import { getTheme } from "@/src/features/games/lib/theme";
import { getIcon } from "../lib/constants";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ZooTermsGridProps {
  attraction: Attraction;
  locale: string;
}

export function ZooTermsGrid({ attraction, locale }: ZooTermsGridProps) {
  const isRtl = locale === "ar";
  const rules = attraction.tags?.rules || [];
  const theme = getTheme(attraction.layout?.customStyle);
  const t = useTranslations("ZooAnimal.terms");

  if (rules.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-neutral-100/10 dark:border-white/5 p-8 md:p-14 shadow-ambient relative overflow-hidden"
      >
        {/* Header Block */}
        <div className={`flex items-center gap-5 mb-12 pb-8 border-b border-neutral-100/50 dark:border-zinc-800 relative z-10 ${
          isRtl ? "flex-row-reverse" : "flex-row"
        }`}>
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <AlertCircle size={28} />
          </div>
          <div className={isRtl ? "text-right" : "text-left"}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#2d2f2f] dark:text-white tracking-wide">
              {t("title")}
            </h2>
            <p className="text-neutral-500 dark:text-zinc-400 text-sm md:text-base mt-2 leading-relaxed max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {rules.map((rule, index) => {
            const Icon = getIcon(rule.type);
            const displayText = rule.text || "";

            return (
              <motion.div
                key={rule._id || index}
                initial={{ opacity: 0, x: isRtl ? 25 : -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`flex items-start gap-5 p-6 rounded-3xl bg-[#f0f1f1] dark:bg-zinc-950/40 hover:bg-[#e6e8e8] dark:hover:bg-zinc-950/80 transition-all duration-300 border border-transparent dark:border-white/5 ${theme.borderHover} group`}
              >
                <div className={`p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100/10 dark:border-white/5 text-neutral-500 dark:text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                  <Icon size={22} />
                </div>
                <p className={`text-neutral-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base pt-1 flex-1 ${
                  isRtl ? "text-right font-cairo" : "text-left font-sans"
                }`}>
                  {displayText}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Theme color ambient glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${theme.glowColor} rounded-full blur-[100px] pointer-events-none opacity-20`} />
      </motion.div>
    </section>
  );
}
