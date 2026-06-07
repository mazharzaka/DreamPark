
import { HeroPortal } from "@/src/features/portal";
import { makeStore } from "@/src/lib/store";
import { apiSlice } from "@/src/lib/features/api/apiSlice";
import { bookingsApi } from "@/src/lib/features/api/bookingsApi";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const store = makeStore();
  const { locale } = await params;
  let heroData = null;

  try {
    // 1. Prefetch hero data
    const result = await store.dispatch(
      apiSlice.endpoints.getHeroByPage.initiate({ lang: locale, pageKey: "home" })
    );
    heroData = result.data;

    // 2. Prefetch attractions for the home page (AdrenalineWorlds)
    await store.dispatch(
      apiSlice.endpoints.getAttractions.initiate({ lang: locale, pageKey: "home" })
    );

    // 3. Prefetch attractions for ticketsets
    await store.dispatch(
      apiSlice.endpoints.getAttractions.initiate({ lang: locale, pageKey: "srts" })
    );

    // 4. Prefetch ticket types
    await store.dispatch(
      bookingsApi.endpoints.getTicketTypes.initiate()
    );

    // 5. Wait for all query queries to resolve on the server
    await Promise.all([
      ...store.dispatch(apiSlice.util.getRunningQueriesThunk()),
      ...store.dispatch(bookingsApi.util.getRunningQueriesThunk()),
    ]);
  } catch (error) {
    console.error("SSR Prefetch failed:", error);
  }

  return (
    <main>
      <HeroPortal data={heroData} />
    </main>
  );
}
