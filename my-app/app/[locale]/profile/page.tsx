import { UserProfile } from "@/src/features/auth/components/UserProfile";
import { Header } from "@/src/components/layout/Header";
import { getTranslations } from "next-intl/server";
import { AuthGuard } from "@/src/features/auth/components/AuthGuard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return {
    title: `Profile | DreamPark`,
  };
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-surface relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      
      <Header />
      
      <div className="pt-24 pb-12">
        <AuthGuard>
          <UserProfile />
        </AuthGuard>
      </div>

    </main>
  );
}
