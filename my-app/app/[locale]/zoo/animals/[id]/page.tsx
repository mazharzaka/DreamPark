import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  ZooAnimalHero, 
  ZooBookingBanner, 
  ZooGallery, 
  ZooTermsGrid 
} from "@/src/features/zoo";
import { getTheme } from "@/src/features/games/lib/theme";

async function getAttraction(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api`
    : "http://localhost:5000/api";
  try {
    const res = await fetch(`${baseUrl}/attractions/${id}`, {
      next: { revalidate: 3600 },
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
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  const attraction = await getAttraction(id);
  if (!attraction) return { title: "Animal Not Found" };

  const name = locale === "ar" ? attraction.name_ar : attraction.name_en;
  const description =
    locale === "ar" ? attraction.description_ar : attraction.description_en;

  return {
    title: `${name} | Dream Zoo`,
    description: description,
    openGraph: {
      images: [attraction.image],
    },
  };
}

export default async function ZooAnimalPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = await params;
  const attraction = await getAttraction(id);

  if (!attraction) {
    notFound();
  }

  const theme = getTheme(attraction.layout?.customStyle);

  return (
    <main className="min-h-screen bg-[#f6f6f6] dark:bg-zinc-950 relative overflow-hidden pb-24">
      {/* Dynamic Background Glows matching the attraction theme */}
      <div
        className={`absolute top-[40vh] -left-60 w-[500px] h-[500px] ${theme.glowColor} rounded-full blur-[150px] pointer-events-none`}
      />
      <div
        className={`absolute bottom-[10vh] -right-60 w-[500px] h-[500px] ${theme.glowColor} rounded-full blur-[150px] pointer-events-none`}
      />

      {/* Cinematic Hero */}
      <ZooAnimalHero attraction={attraction} locale={locale} />

      <div className="container px-6 py-20 mx-auto flex flex-col gap-20 relative z-10">
        {/* Booking Card & Details */}
        <ZooBookingBanner attraction={attraction} locale={locale} />

        {/* Gallery Showcase */}
        <ZooGallery attraction={attraction} locale={locale} />

        {/* Rules and Safety Instructions */}
        <ZooTermsGrid attraction={attraction} locale={locale} />
      </div>
    </main>
  );
}
