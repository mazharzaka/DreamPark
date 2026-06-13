import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Cairo, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import LocalePersistence from "@/src/components/ui/LocalePersistence";
import StoreProvider from "@/app/StoreProvider";
import { SplashScreenWrapper } from "@/src/components/ui/SplashScreenWrapper";
import { AuthProvider } from "@/src/lib/features/auth/AuthContext";
import ErudaProvider from "@/src/components/ui/ErudaProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "دريم بارك | مدينة الملاهي الأولى" : "Dream Park | The Premier Theme Park",
    description: isAr
      ? "مرحباً بكم في دريم بارك، أكبر مدينة ملاهي ترفيهية متكاملة تقدم ألعاباً مثيرة، عروضاً ترفيهية ومغامرات لا تُنسى لجميع أفراد العائلة."
      : "Welcome to Dream Park, the ultimate theme park offering thrilling rides, interactive family shows, and unforgettable adventures.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} ${cairo.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <AuthProvider>
              <ErudaProvider />
              <SplashScreenWrapper />
              <LocalePersistence />
              <Header />

              {children}
              <Footer />
            </AuthProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
