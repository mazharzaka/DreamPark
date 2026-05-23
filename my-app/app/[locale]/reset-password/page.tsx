import { AuthLayout } from "@/src/features/auth/components/AuthLayout";
import { ResetPassword } from "@/src/features/auth/components/ResetPassword";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: `Reset Password | DreamPark`,
  };
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout imageSrc="/games/discovery.png">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </AuthLayout>
  );
}
