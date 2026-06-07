"use client";

import dynamic from "next/dynamic";
import { MOCK_HEROES } from "@/src/features/portal/data/mockHeroes";
import React from "react";
import { useGetAttractionsQuery, useGetHeroByPageQuery } from "@/src/lib/features/api/apiSlice";
import { useLocale } from "next-intl";

// HeroSlider — above the fold, show spinner while Swiper + EffectFade loads
const HeroSlider = dynamic(
  () => import("@/src/features/portal/components/HeroSlider").then((mod) => mod.HeroSlider),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

// AdrenalineWorlds — below the fold, skeleton with card grid proportions
const AdrenalineWorlds = dynamic(
  () =>
    import("@/src/features/portal/components/AdrenalineWorlds").then(
      (mod) => mod.AdrenalineWorlds
    ),
  {
    ssr: false,
    loading: () => (
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="h-10 w-1/3 bg-gray-100 rounded-full animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0 ? "md:col-span-2 md:row-span-2 min-h-[500px]" : "min-h-[240px]"}`}
            />
          ))}
        </div>
      </div>
    ),
  }
);

// OurHeroesSlider — below the fold, skeleton with horizontal card row
const OurHeroesSlider = dynamic(
  () =>
    import("@/src/features/portal/components/OurHeroesSlider").then(
      (mod) => mod.OurHeroesSlider
    ),
  {
    ssr: false,
    loading: () => (
      <div className="py-8 px-4 md:px-8">
        <div className="h-8 w-1/4 bg-gray-100 rounded-full animate-pulse mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[350px] md:h-[450px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    ),
  }
);

function ZooPage() {
  const locale = useLocale();
  const { data: animals } = useGetAttractionsQuery({
    lang: locale,
    pageKey: "zoo",
    category: "animals",
  });
  const { data: heroData, isLoading: heroLoading } = useGetHeroByPageQuery({
    lang: locale,
    pageKey: "zoo",
  });

  return (
    <main>
      <div className="relative w-full h-screen overflow-hidden">
        <HeroSlider
          slides={heroData?.data?.slides || []}
          isLoading={heroLoading}
        />
      </div>
      <div>
        <AdrenalineWorlds
          title="DreamZoo"
          link="zoo/animals"
          attractions={animals?.data?.items}
        />
      </div>
      <OurHeroesSlider mockHeroes={MOCK_HEROES} title="Portal.OurHeroes" />
    </main>
  );
}

export default ZooPage;

