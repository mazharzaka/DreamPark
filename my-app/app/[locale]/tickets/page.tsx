"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Edit2 } from "lucide-react";
import { useGetTicketTypesQuery, useUpdateTicketPriceMutation } from "@/src/lib/features/api/bookingsApi";
import { PassCard } from "@/src/features/tickets/components/PassCard";
import { useLocale, useTranslations } from "next-intl";

export default function AllTicketsPage() {
  const { data: typesRes, isLoading } = useGetTicketTypesQuery();
  const ticketTypes = typesRes?.data ?? [];
  const t = useTranslations("Tickets");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [selectedCategory, setSelectedCategory] = useState<"INDIVIDUAL" | "GROUP">("INDIVIDUAL");

  const filteredTickets = ticketTypes.filter(ticket => ticket.category === selectedCategory);

  useEffect(() => {
    if (ticketTypes.length > 0) {
    }
  }, [ticketTypes]);


  const handleSelect = (id: string) => {
    console.log(id);

  };
  return (
    <div className="min-h-screen bg-[#f6f6f6] p-8 rtl mt-25" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-[#005caa] text-4xl font-extrabold mb-2 font-['Plus_Jakarta_Sans']">
            {t.rich('heading', { span: (chunks: any) => <span className="text-secondary italic font-bold">{chunks}</span> })}
          </h1>
          <p className="text-[#2d2f2f] opacity-70">{t("description")}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#005caa] animate-spin" />
          </div>
        ) : (
          <>
            {/* CATEGORY SWITCHER BUTTONS */}
            <div className="flex justify-center mb-10">
              <div className="bg-[#f0f1f1] p-1.5 rounded-full flex gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("INDIVIDUAL")}
                  className={`px-8 py-3.5 rounded-full font-black text-sm transition-all duration-300 ${
                    selectedCategory === "INDIVIDUAL" 
                      ? "bg-white text-secondary shadow-md" 
                      : "text-on-surface/70 hover:text-on-surface"
                  }`}
                >
                  {tBooking("individual_tabs")}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("GROUP")}
                  className={`px-8 py-3.5 rounded-full font-black text-sm transition-all duration-300 ${
                    selectedCategory === "GROUP" 
                      ? "bg-white text-secondary shadow-md" 
                      : "text-on-surface/70 hover:text-on-surface"
                  }`}
                >
                  {tBooking("group_tabs")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
              {filteredTickets.map((ticket, i) => (
                <PassCard
                  key={ticket.id || ticket._id}
                  tier={ticket}
                  onSelect={handleSelect}
                  isRtl={isRtl}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
