import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GameHero } from "@/src/features/games/components/GameHero";
import { BookingPanel } from "@/src/features/games/components/BookingPanel";
import { TermsAndConditions } from "@/src/features/games/components/TermsAndConditions";

async function getAttraction(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${baseUrl}/attractions/${id}`, {
      cache: "no-store", // Ensure we get fresh data
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch attraction data");
    }

    const result = await res.json();
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const { locale, id } = params;

  const attraction = await getAttraction(id);
  if (!attraction) return { title: "Game Not Found" };

  const name = locale === 'ar' ? attraction.name_ar : attraction.name_en;
  const description = locale === 'ar' ? attraction.description_ar : attraction.description_en;

  return {
    title: `${name} | Dream Park`,
    description: description,
    openGraph: {
      images: [attraction.image],
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = await params;
  const attraction = await getAttraction(id);

  if (!attraction) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050B18]">
      <GameHero attraction={attraction} locale={locale} />

      <div className="container px-4 py-16 mx-auto flex flex-col gap-12">
        <BookingPanel attraction={attraction} locale={locale} />
        <TermsAndConditions attraction={attraction} locale={locale} />
      </div>
    </main>
  );
}
