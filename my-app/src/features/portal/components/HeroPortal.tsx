"use client";
import { HeroSlider } from "./HeroSlider";
import { AdrenalineWorlds } from "./AdrenalineWorlds";
import { DreamZoo } from "./DreamZoo";
import { OurHeroesSlider } from "./OurHeroesSlider";
import { MapContainer } from "../../explore";
import { TicketsSection } from "../../tickets";
import { MOCK_TICKETSETS } from "../data/mockAttractions";
import { MOCK_DOBY } from "../data/mockHeroes";
import { Ticketsets } from "./Ticketsets";
import Merch from "./Merch";
import { useGetAttractionsQuery } from "@/src/lib/features/api/apiSlice";
import { useLocale } from "next-intl";

export function HeroPortal({ data }: { data: any }) {
  const locale = useLocale();
  const { data: attractions } = useGetAttractionsQuery({ lang: locale });
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="relative w-full h-screen overflow-hidden">
        <HeroSlider slides={data?.data?.slides || []} isLoading={data?.isLoading || false} />
      </div>
      <AdrenalineWorlds title="Attractions" attractions={attractions?.data?.items} />
      <DreamZoo />
      <OurHeroesSlider mockHeroes={MOCK_DOBY} title="Dopy" />
      <Merch />
      <MapContainer />
      <Ticketsets title="Ticketsets" attractions={MOCK_TICKETSETS} />
      <TicketsSection />
    </div>
  );
}
