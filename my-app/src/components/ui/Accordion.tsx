import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, MapPin, Sparkles, Ticket } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

export default function Accordion() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
   const t = useTranslations("ParkInfo");
 
  const locale = useLocale();
  const isRtl = locale === "ar";
  const faqs = [
    {
      id: "q1",
      icon: Ticket,
      question: t("faqs.q1"),
      answer: t("faqs.a1"),
    },
    {
      id: "q2",
      icon: Clock,
      question: t("faqs.q2"),
      answer: t("faqs.a2"),
    },
    {
      id: "q3",
      icon: MapPin,
      question: t("faqs.q3"),
      answer: t("faqs.a3"),
    },
    {
      id: "q4",
      icon: Sparkles,
      question: t("faqs.q4"),
      answer: t("faqs.a4"),
    },
  ];
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  return (
    <section className="py-24 bg-surface relative">
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-black text-secondary">
              {t("faqTitle")}
            </h2>
            <p className="text-on-surface/70 text-base md:text-lg font-medium leading-relaxed">
              {t("faqSubtitle")}
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            const FaqIcon = faq.icon;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-start flex items-center justify-between gap-4 font-extrabold text-base md:text-lg text-on-surface hover:text-secondary transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl bg-secondary/5 text-secondary`}
                    >
                      <FaqIcon className="w-5.5 h-5.5" />
                    </div>
                    <span>{faq.question}</span>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-on-surface/40 hover:text-secondary"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isRtl
                    ? isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 font-medium text-sm md:text-base text-on-surface/70 leading-relaxed font-cairo pr-[62px]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )
                    : isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 font-medium text-sm md:text-base text-on-surface/70 leading-relaxed font-sans pl-[62px]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
