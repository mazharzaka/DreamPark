"use client";

import { useTranslations, useLocale } from "next-intl";
import { Attraction } from "../types";
import Image from "next/image";
import { getOptimizedCloudinaryUrl } from "@/src/lib/cloudinary";

function renderAttractionCard(attr: Attraction, locale: string) {
  const isRtl = locale === "ar";
  const colSpanClass =
    attr.layout.colSpan === 2 ? "md:col-span-2" : "md:col-span-1";
  const rowSpanClass =
    attr.layout.rowSpan === 2 ? "md:row-span-2" : "md:row-span-1";

  const baseClasses = `relative rounded-3xl overflow-hidden group ${colSpanClass} ${rowSpanClass} shadow-sm`;

  return (
    <div
      key={attr._id}
      className={baseClasses}
      style={{ minHeight: attr.layout.rowSpan === 2 ? "700px" : "240px" }}
    >
      {/* Fallback Gradient */}

      {/* Background Image */}
      <Image
        src={getOptimizedCloudinaryUrl(attr.image)}
        alt={attr.title || ''}
        fill
        loading="lazy"
        className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

export function Ticketsets({
  attractions,
  title,
}: {
  attractions?: Attraction[];
  title: string;
}) {
  const t = useTranslations(title);
  const locale = useLocale();

  return (
    <section className="bg-white py-3 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-1 gap-x-12 gap-y-6">
          <div className=" flex  justify-between w-full">
            <div>
              <h2
                className={`text-5xl md:text-6xl text-start font-black text-primary tracking-tight mb-4 antialiased ${locale === "ar" ? "font-cairo" : "font-sans"}`}
              >
                {t.rich("title", {
                  span: (chunks) => (
                    <span className="text-secondary italic font-bold">
                      {chunks}
                    </span>
                  ),
                })}
              </h2>
              <p className="text-lg text-secondary/70 leading-relaxed font-medium">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-4  gap-4`}>
          {attractions?.map((attr) => renderAttractionCard(attr, locale))}
        </div>
      </div>
    </section>
  );
}
