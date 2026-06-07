"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Crown, Users, Award, Ticket, Check } from "lucide-react";
import { TicketProduct } from "../lib/ticket-data";
import Link from "next/link";

const MASTER_FEATURES = [
  {
    id: "rides_standard",
    textAr: "دخول الألعاب والمعالم العادية",
    textEn: "Access to standard rides & attractions",
  },
  {
    id: "digital_exhibits",
    textAr: "دخول المعارض الرقمية التفاعلية",
    textEn: "Full entry to digital exhibits",
  },
  {
    id: "animal_conservatory",
    textAr: "دخول محمية ومناطق الحيوانات",
    textEn: "Access to the animal conservatory",
  },
  {
    id: "park_wifi",
    textAr: "خدمة إنترنت لاسلكي مجاني",
    textEn: "Free park-wide Wi-Fi access",
  },
  {
    id: "fast_track",
    textAr: "دخول سريع وتخطي الطوابير",
    textEn: "Priority Fast-Track skip-the-line queue",
  },
  {
    id: "vip_lounges",
    textAr: "دخول استراحات كبار الشخصيات الراقية",
    textEn: "Access to exclusive VIP rest lounges",
  },
  {
    id: "locker_rental",
    textAr: "تأجير خزائن مجانية طوال اليوم",
    textEn: "Free locker rentals for the entire day",
  },
  {
    id: "meal_voucher",
    textAr: "قسيمة وجبات مجانية عالمية",
    textEn: "Complimentary premium meal voucher",
  },
];

interface PassCardProps {
  tier: TicketProduct;
  onSelect: (id: string) => void;
  isRtl: boolean;
}

export function PassCard({ tier, onSelect, isRtl }: PassCardProps) {
  const t = useTranslations("Tickets");

  const isPopular =
    tier.name.toLowerCase().includes("gold") ||
    (tier.nameAr && tier.nameAr.includes("ذهب"));
  const color = isPopular ? "#d4af37" : "#005caa";
  const name = isRtl ? tier.nameAr || tier.name : tier.name;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return Sparkles;
      case "Crown":
        return Crown;
      case "Users":
        return Users;
      case "Award":
        return Award;
      default:
        return Ticket;
    }
  };
  const IconComp = getIconComponent(tier?.icon || "");

  // Split description by newlines or dashes if they exist, otherwise it's just one feature
  // const features = description && description.split(/\n|-/) ? description?.split(/\n|-/).filter(f => f.trim().length > 0) : [];

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative w-full md:max-w-[480px] w-full rounded-[40px] p-10 flex flex-col items-center bg-white shadow-ambient border-2 border-transparent transition-all duration-300 hover:border-primary/10 overflow-hidden ${isPopular ? "scale-105 z-10" : ""}`}
    >
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#755700] text-white text-[10px] font-bold uppercase tracking-widest rounded-b-2xl">
          {t("mostPopular")}
        </div>
      )}

      {/* Name & Price */}
      <div
        className={`w-full mb-8 md:min-h-[250px] h-full mt-4 ${isRtl ? "text-right" : "text-left"}`}
      >
        <div
          className={`flex items-center gap-3 mb-4 ${isRtl ? "justify-end" : ""}`}
        >
          <h3
            className={`text-[2.778vw] font-black text-primary mb-6 ${isRtl ? "font-cairo" : "font-sans"}`}
          >
            {name}
          </h3>
          <div
            className="p-3.5 rounded-2xl text-white flex items-center justify-center shadow-lg"
            style={{ backgroundColor: tier.color || "#b5161e" }}
          >
            <IconComp className="w-6 h-6" />
          </div>
        </div>
        <div
          className={`flex items-baseline gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <>
            <span className="text-3xl font-black text-[#b5161e] font-sans">
              {tier.price * (1 - (tier.discount || 0) / 100)} {t("egp")}
            </span>
            <span className="text-sm line-through text-on-surface/40">
              {tier.price} {t("egp")}
            </span>
          </>{" "}
          <span className="text-primary/40 text-sm font-bold lowercase">
            / {t("person")}
          </span>
        </div>
      </div>

      {/* Features Comparison Grid */}
      <div className="w-full space-y-4 mb-12 flex-grow flex flex-col justify-start">
        {MASTER_FEATURES.map((feature) => {
          const isAvailable = !!tier.features?.[feature.id];
          return (
            <div
              key={feature.id}
              className={`flex items-center gap-3 min-h-[32px] transition-all duration-300 ${
                isRtl ? "flex-row-reverse text-right" : "text-left"
              } ${isAvailable ? "text-primary font-semibold opacity-100" : "text-primary/40 font-medium"}`}
            >
              {isAvailable ? (
                <span
                  className="w-5 h-5 rounded-full  text-white flex items-center justify-center shrink-0 text-xs font-black"
                  style={{ backgroundColor: tier.color || "#b5161e" }}
                >
                  ✓
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-500 flex items-center justify-center shrink-0 text-xs font-black">
                  ✗
                </span>
              )}
              <span className="text-sm">
                {isRtl ? feature.textAr : feature.textEn}
              </span>
            </div>
          );
        })}
      </div>

      {/* Select Button */}
      <Link
        className="w-full py-5 rounded-[24px] w-fit mt-auto flex justify-center items-center text-white font-bold uppercase tracking-widest text-sm shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-primary/10"
        style={{ backgroundColor: tier.color || color }}
        href={`/${isRtl ? "ar" : "en"}/pass/${tier.id}`}
      >
        {t("cta")}
      </Link>

      {/* Decorative Connectors (as seen in image) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-l-full" />
    </motion.div>
  );
}
