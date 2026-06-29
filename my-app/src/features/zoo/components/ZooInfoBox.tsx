"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

export function ZooInfoBox() {
  const t = useTranslations("ZooAnimal.infoBox");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-ambient p-4 max-w-[260px] group transition-all duration-300 hover:bg-white/15">
      {/* Subtle Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:10px_10px]" 
      />
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:scale-110 transition-transform">
          <Clock size={20} className="animate-pulse" />
        </div>
        <div className="flex flex-col text-start">
          <span className="text-[10px] uppercase font-black tracking-widest text-white/60">
            {t("duration")}
          </span>
          <span className="text-sm font-black text-white whitespace-nowrap">
            {t("label")}
          </span>
        </div>
      </div>
    </div>
  );
}
