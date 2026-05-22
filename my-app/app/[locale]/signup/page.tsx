import { AuthLayout } from "@/src/features/auth/components/AuthLayout";
import { SignupForm } from "@/src/features/auth/components/SignupForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: `${t("signup.title")} | DreamPark`,
  };
}

export default function SignupPage() {
  return (
    <AuthLayout imageSrc="/games/rocket.jpg">
      <SignupForm />
    </AuthLayout>
  );
}
