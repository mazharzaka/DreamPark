"use client";
import { HeroSlider } from "./HeroSlider";
import { AdrenalineWorlds } from "./AdrenalineWorlds";
import { DreamZoo } from "./DreamZoo";
import { OurHeroesSlider } from "./OurHeroesSlider";
import { MapContainer } from "../../explore";
import { TicketsSection } from "../../tickets";
import { MOCK_DOBY } from "../data/mockHeroes";
import { Ticketsets } from "./Ticketsets";
import Merch from "./Merch";
import { useGetAttractionsQuery } from "@/src/lib/features/api/apiSlice";
import { useLocale } from "next-intl";
import { useGetTicketTypesQuery } from "@/src/lib/features/api/bookingsApi";

export function HeroPortal({ data }: { data: any }) {
  const locale = useLocale();
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,

  } = useGetAttractionsQuery({
    lang: locale,
    pageKey: 'home',
    category: undefined
  });
  const {
    data: setsData,


  } = useGetAttractionsQuery({
    lang: locale,
    pageKey: 'srts',
    category: undefined
  });
  const { data: typesRes, isLoading: typesLoading, error: typesError } = useGetTicketTypesQuery();


  return (
    <div className="w-full bg-white min-h-screen">
      <div className="relative w-full h-screen overflow-hidden">
        <HeroSlider slides={data?.data?.slides || []} isLoading={data?.isLoading || false} />
      </div>
      <AdrenalineWorlds title="Attractions" attractions={gamesData?.data?.items} />
      <DreamZoo />
      <OurHeroesSlider mockHeroes={MOCK_DOBY} title="Dopy" />
      <Merch />
      <MapContainer />
      <Ticketsets title="Ticketsets" attractions={setsData?.data?.items} />
      <TicketsSection typesRes={typesRes?.data.slice(0, 3)} typesLoading={typesLoading} typesError={typesError} />
    </div>
  );
}
