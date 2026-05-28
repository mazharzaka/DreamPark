import { AuthLayout } from "@/src/features/auth/components/AuthLayout";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: `${t("login.title")} | DreamPark`,
  };
}

export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/games/discovery.png">
      <LoginForm />
    </AuthLayout>
  );
}
