"use client";
import { MOCK_DOBY } from "../data/mockHeroes";
import { useGetAttractionsQuery } from "@/src/lib/features/api/apiSlice";
import { useLocale } from "next-intl";
import { useGetTicketTypesQuery } from "@/src/lib/features/api/bookingsApi";
import dynamic from "next/dynamic";

const HeroSlider = dynamic(() => import("./HeroSlider").then((mod) => mod.HeroSlider), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-surface flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const AdrenalineWorlds = dynamic(() => import("./AdrenalineWorlds").then((mod) => mod.AdrenalineWorlds), {
  ssr: false,
  loading: () => (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-gray-100 animate-pulse ${i === 0 ? "md:col-span-2 md:row-span-2 min-h-[500px]" : "min-h-[240px]"}`}
          />
        ))}
      </div>
    </div>
  ),
});

const DreamZoo = dynamic(() => import("./DreamZoo").then((mod) => mod.DreamZoo), {
  ssr: false,
  loading: () => (
    <div className="py-20 px-4 md:px-8 bg-[#f9f8f4]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-4">
          <div className="h-12 w-2/3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 hidden md:block h-[500px] bg-gray-200 rounded-[40px] animate-pulse" />
      </div>
    </div>
  ),
});

const OurHeroesSlider = dynamic(() => import("./OurHeroesSlider").then((mod) => mod.OurHeroesSlider), {
  ssr: false,
  loading: () => (
    <div className="py-8 px-4 md:px-8">
      <div className="h-8 w-56 bg-gray-100 rounded-full animate-pulse mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[350px] md:h-[450px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

const MapContainer = dynamic(() => import("../../explore").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => (
    <div className="py-20 px-4 md:px-8">
      <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse mb-6" />
      <div className="h-[700px] bg-gray-100 animate-pulse rounded-[40px]" />
    </div>
  ),
});

const Ticketsets = dynamic(() => import("./Ticketsets").then((mod) => mod.Ticketsets), {
  ssr: false,
  loading: () => (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-gray-100 animate-pulse min-h-[240px]" />
        ))}
      </div>
    </div>
  ),
});

const TicketsSection = dynamic(() => import("../../tickets").then((mod) => mod.TicketsSection), {
  ssr: false,
  loading: () => (
    <div className="py-24 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse mb-12" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[600px] rounded-[40px] bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Merch = dynamic(() => import("./Merch"), {
  ssr: false,
  loading: () => (
    <div className="py-16 px-4 md:px-8 bg-background">
      <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-[2rem] bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

const Accordion = dynamic(() => import("@/src/components/ui/Accordion"), {
  ssr: false,
  loading: () => (
    <div className="py-24 px-6 max-w-4xl mx-auto space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  ),
});

export function HeroPortal({ data }: { data: any }) {
  const locale = useLocale();
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useGetAttractionsQuery({
    lang: locale,
    pageKey: "home",
    category: undefined,
  });
  const { data: setsData } = useGetAttractionsQuery({
    lang: locale,
    pageKey: "srts",
    category: undefined,
  });
  const {
    data: typesRes,
    isLoading: typesLoading,
    error: typesError,
  } = useGetTicketTypesQuery();

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="relative w-full h-screen overflow-hidden">
        <HeroSlider
          slides={data?.data?.slides || []}
          isLoading={data?.isLoading || false}
        />
      </div>
      <AdrenalineWorlds
        title="Attractions"
        attractions={gamesData?.data?.items}
      />
      <DreamZoo />
      <OurHeroesSlider mockHeroes={MOCK_DOBY} title="Dopy" />
      <Merch />
      <MapContainer />
      <Ticketsets title="Ticketsets" attractions={setsData?.data?.items} />
      <TicketsSection
        typesRes={typesRes?.data.slice(0, 3)}
        typesLoading={typesLoading}
        typesError={typesError}
      />
      <Accordion />
    </div>
  );
}
