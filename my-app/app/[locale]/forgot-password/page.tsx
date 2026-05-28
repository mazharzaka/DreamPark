import { AuthLayout } from "@/src/features/auth/components/AuthLayout";
import { ForgotPassword } from "@/src/features/auth/components/ForgotPassword";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: `Forgot Password | DreamPark`,
  };
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout imageSrc="/games/discovery.png">
      <ForgotPassword />
    </AuthLayout>
  );
}
