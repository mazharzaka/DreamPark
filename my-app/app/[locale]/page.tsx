
import { HeroPortal } from "@/src/features/portal";
import { makeStore } from "@/src/lib/store";
import { apiSlice } from "@/src/lib/features/api/apiSlice";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const store = makeStore();
  const { locale } = await params;
  let heroData = null;

  try {
    // 1. Prefetch hero data (promise)
    const heroPromise = store.dispatch(
      apiSlice.endpoints.getHeroByPage.initiate({ lang: locale, pageKey: "home" })
    );

    // Get heroData
    const result = await heroPromise;
    heroData = result.data;

    // 2. Wait for the hero query to resolve on the server
    await Promise.all([
      ...store.dispatch(apiSlice.util.getRunningQueriesThunk()),
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
