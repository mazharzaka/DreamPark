
import { HeroPortal } from "@/src/features/portal";
import { makeStore } from "@/src/lib/store";
import { apiSlice } from "@/src/lib/features/api/apiSlice";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const store = makeStore();
  const { locale } = await params;
  let heroData = null;

  try {
    const result = await store.dispatch(apiSlice.endpoints.getHeroByPage.initiate({ lang: locale, pageKey: 'home' }));
    heroData = result.data;
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
  } catch (error) {
    console.error("SSR Prefetch failed:", error);
  }

  return (
    <main>
      <HeroPortal data={heroData} />
    </main>
  );
}
