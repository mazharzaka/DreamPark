"use client";
import { AdrenalineWorlds } from "@/src/features/portal/components/AdrenalineWorlds";
import { OurHeroesSlider } from "@/src/features/portal/components/OurHeroesSlider";
import { MOCK_HEROES } from "@/src/features/portal/data/mockHeroes";
import React from "react";
import { useGetAttractionsQuery, useGetHeroByPageQuery } from "@/src/lib/features/api/apiSlice";

import { useLocale } from "next-intl";
import { HeroSlider } from "@/src/features/portal/components/HeroSlider";

function ZooPage() {
  const locale = useLocale();
  const { data: animals } = useGetAttractionsQuery({
    lang: locale,
    pageKey: "zoo",
    category: "animals",
  });
  const { data: heroData, isLoading: heroLoading } = useGetHeroByPageQuery({
    lang: locale,
    pageKey: 'zoo'
  });
  return (
    <main className="mt-[106px]">
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
