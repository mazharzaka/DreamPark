import { AuthLayout } from '@/src/features/auth/components/AuthLayout';
import { LoginForm } from '@/src/features/auth/components/LoginForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return {
    title: `${t('login.title')} | DreamPark`,
  };
}

export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/child/zoo1.jpg">
      <LoginForm />
    </AuthLayout>
  );
}
