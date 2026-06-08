"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Calendar,
  Map,
  Users,
  Compass,
  Clock,
  MapPin,
  Ticket,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { EditorialButton } from "@/src/components/ui/EditorialButton";

const Accordion = dynamic(() => import("@/src/components/ui/Accordion"), {
  ssr: false,
  loading: () => (
    <div className="py-24 px-6 max-w-4xl mx-auto space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-[#f0f1f1] animate-pulse" />
      ))}
    </div>
  ),
});

// Client-Side Mount Guarding to prevent hydration issues
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export default function ParkInfoPage() {
  const t = useTranslations("ParkInfo");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const mounted = useMounted();

  // Accordion toggle states
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Fonts class
  const fontClass = isRtl ? "font-cairo" : "font-sans";

  // Quick facts array
  const facts = [
    {
      icon: Calendar,
      label: t("fact1Label"),
      value: t("fact1Value"),
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
    {
      icon: Map,
      label: t("fact2Label"),
      value: t("fact2Value"),
      color: "text-secondary",
      bgColor: "bg-secondary/5",
    },
    {
      icon: Users,
      label: t("fact3Label"),
      value: t("fact3Value"),
      color: "text-emerald",
      bgColor: "bg-emerald/5",
    },
    {
      icon: Compass,
      label: t("fact4Label"),
      value: t("fact4Value"),
      color: "text-tertiary",
      bgColor: "bg-tertiary/5",
    },
  ];

  // Timeline milestones array
  const milestones = [
    {
      key: "m1",
      year: t("milestones.m1.year"),
      title: t("milestones.m1.title"),
      desc: t("milestones.m1.desc"),
      gradient: "from-primary/20 to-primary/5",
      accentColor: "#b5161e",
    },
    {
      key: "m2",
      year: t("milestones.m2.year"),
      title: t("milestones.m2.title"),
      desc: t("milestones.m2.desc"),
      gradient: "from-secondary/20 to-secondary/5",
      accentColor: "#005caa",
    },
    {
      key: "m3",
      year: t("milestones.m3.year"),
      title: t("milestones.m3.title"),
      desc: t("milestones.m3.desc"),
      gradient: "from-emerald/20 to-emerald/5",
      accentColor: "#10b981",
    },
    {
      key: "m4",
      year: t("milestones.m4.year"),
      title: t("milestones.m4.title"),
      desc: t("milestones.m4.desc"),
      gradient: "from-tertiary/20 to-tertiary/5",
      accentColor: "#755700",
    },
  ];

  // Zones grid array
  const zones = [
    {
      key: "z1",
      name: t("zones.z1.name"),
      desc: t("zones.z1.desc"),
      image:
        "https://images.unsplash.com/photo-1513829096999-4978602297f7?q=80&w=600&auto=format&fit=crop",
      theme: "from-secondary to-secondary/80",
      accent: "text-secondary",
    },
    {
      key: "z2",
      name: t("zones.z2.name"),
      desc: t("zones.z2.desc"),
      image:
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop",
      theme: "from-emerald to-emerald/80",
      accent: "text-emerald",
    },
    {
      key: "z3",
      name: t("zones.z3.name"),
      desc: t("zones.z3.desc"),
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
      theme: "from-tertiary to-tertiary/80",
      accent: "text-tertiary",
    },
    {
      key: "z4",
      name: t("zones.z4.name"),
      desc: t("zones.z4.desc"),
      image:
        "https://images.unsplash.com/photo-1519074069444-1ba4e666543b?q=80&w=600&auto=format&fit=crop",
      theme: "from-pink-600 to-pink-500",
      accent: "text-pink-600",
    },
    {
      key: "z5",
      name: t("zones.z5.name"),
      desc: t("zones.z5.desc"),
      image:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
      theme: "from-primary to-primary/80",
      accent: "text-primary",
    },
  ];

  const handleScrollToInfo = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    const target = document.getElementById("info-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Prevent hydration flicker by keeping a simple structural placeholder
  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-surface ${fontClass} overflow-x-hidden`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Abstract Background Splashes */}
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-secondary/5 blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-primary/5 blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-start flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dream Park Legacy</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface leading-tight tracking-tight max-w-xl">
                  {isRtl ? (
                    <>
                      إرث من{" "}
                      <span className="bg-gradient-to-r from-primary to-[#ff766d] bg-clip-text text-transparent italic">
                        الفرح
                      </span>{" "}
                      والبهجة
                    </>
                  ) : (
                    <>
                      Legacy of{" "}
                      <span className="bg-gradient-to-r from-primary to-[#ff766d] bg-clip-text text-transparent italic">
                        Joy
                      </span>{" "}
                      & Wonder
                    </>
                  )}
                </h1>

                <p className="text-on-surface/75 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                  {t("heroSubtitle")}
                </p>

                <div className="pt-4 flex justify-center lg:justify-start">
                  <EditorialButton
                    variant="primary"
                    link="#info-content"
                    onClick={handleScrollToInfo}
                    className="group"
                  >
                    <span>{t("heroCta")}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </EditorialButton>
                </div>
              </motion.div>
            </div>

            {/* Right Asymmetric Overlay Graphic */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[400px] aspect-[4/5] rounded-[36px] bg-gradient-to-tr from-secondary/10 to-primary/10 p-2 shadow-ambient"
              >
                {/* Floating Micro-Animation Overlay */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-2 overflow-hidden rounded-[28px]"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop"
                    alt="Dream Park Magic"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-full object-cover grayscale-[15%] contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent opacity-80" />
                </motion.div>

                {/* Floating Glassmorphism Stat Panel */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 md:-left-10 glassmorphism p-5 rounded-2xl shadow-ambient max-w-[220px]"
                >
                  <p className="text-secondary font-black text-xs uppercase tracking-wider mb-1">
                    {isRtl ? "مفتوح اليوم" : "OPEN TODAY"}
                  </p>
                  <p className="text-on-surface text-base font-extrabold">
                    9:00 AM - 11:00 PM
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse" />
                    <span className="text-on-surface/70 text-xs font-semibold">
                      {isRtl ? "ألعاب نشطة وفعاليات" : "Active Park Events"}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS GRID */}
      <section
        id="info-content"
        className="py-24 bg-surface-container-low transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-black text-secondary">
                {t("factsTitle")}
              </h2>
              <p className="text-on-surface/70 text-base md:text-lg font-medium leading-relaxed">
                {t("factsSubtitle")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {facts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient hover:scale-[1.03] transition-transform duration-300 flex flex-col items-center text-center"
                >
                  <div className={`p-4 rounded-2xl ${fact.bgColor} mb-6`}>
                    <Icon className={`w-8 h-8 ${fact.color}`} />
                  </div>
                  <h3 className="text-on-surface/60 text-xs uppercase tracking-widest font-black mb-2">
                    {fact.label}
                  </h3>
                  <p className="text-on-surface text-3xl font-black">
                    {fact.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE HISTORY TIMELINE */}
      <section className="py-24 relative overflow-hidden bg-surface">
        <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] rounded-full bg-tertiary/5 blur-[90px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-black text-secondary">
                {t("historyTitle")}
              </h2>
              <p className="text-on-surface/70 text-base md:text-lg font-medium leading-relaxed">
                {t("historySubtitle")}
              </p>
            </motion.div>
          </div>

          {/* Vertical Timeline Layout */}
          <div className="relative max-w-4xl mx-auto">
            {/* Central Timeline Bar (Uses Tonal Layering color shift, strictly NO 1px solid line) */}
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-3 rounded-full bg-surface-container-low -translate-x-1.5 pointer-events-none" />

            <div className="space-y-16">
              {milestones.map((milestone, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={milestone.key}
                    className="relative flex flex-col md:flex-row items-start md:items-center"
                  >
                    {/* Central Node Indicator */}
                    <div
                      className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-surface-container-lowest shadow-ambient -translate-x-3 z-10 flex items-center justify-center"
                      style={{ border: `4px solid ${milestone.accentColor}` }}
                    />

                    {/* Milestone Card Column */}
                    <div
                      className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? "md:pr-12 md:text-end" : "md:pl-12 md:order-last"}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient space-y-4 hover:shadow-2xl transition-all duration-300"
                      >
                        <div
                          className="inline-block px-4 py-1.5 rounded-full text-white font-extrabold text-sm uppercase tracking-wider"
                          style={{ backgroundColor: milestone.accentColor }}
                        >
                          {milestone.year}
                        </div>
                        <h3 className="text-2xl font-extrabold text-on-surface">
                          {milestone.title}
                        </h3>
                        <p className="text-on-surface/70 text-sm md:text-base font-medium leading-relaxed">
                          {milestone.desc}
                        </p>
                      </motion.div>
                    </div>

                    {/* Spacer block on desktop */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PARK ZONES GRID */}
      <section className="py-24 bg-surface-container-low transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-black text-secondary">
                {t("zonesTitle")}
              </h2>
              <p className="text-on-surface/70 text-base md:text-lg font-medium leading-relaxed">
                {t("zonesSubtitle")}
              </p>
            </motion.div>
          </div>

          {/* Custom Editorial Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {zones.map((zone, idx) => {
              // Asymmetric grid column spanning
              const colSpans = [
                "md:col-span-3", // z1
                "md:col-span-3", // z2
                "md:col-span-2", // z3
                "md:col-span-2", // z4
                "md:col-span-2", // z5
              ];
              const spanClass = colSpans[idx] || "md:col-span-2";

              return (
                <motion.div
                  key={zone.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className={`${spanClass} relative overflow-hidden rounded-[32px] group aspect-[4/3] md:aspect-auto md:h-[350px] shadow-ambient hover:scale-[1.02] transition-transform duration-300`}
                >
                  <Image
                    src={zone.image}
                    alt={zone.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.8] contrast-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${zone.theme} mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />

                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/30 to-transparent" />

                  {/* Content (Bottom left aligned in LTR) */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest mb-2">
                      <Layers className="w-3 h-3" />
                      <span>
                        {isRtl ? `منطقة ${idx + 1}` : `Zone 0${idx + 1}`}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white">
                      {zone.name}
                    </h3>

                    <p className="text-white/80 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
                      {zone.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISITOR INFO ACCORDION */}

      <Accordion />
    </div>
  );
}
