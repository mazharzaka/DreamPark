'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/src/i18n/routing';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { validateEmail } from '../utils/validation';

export const LoginForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'errors.required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'errors.emailInvalid';
    }

    if (!formData.password) {
      newErrors.password = 'errors.required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Mock successful login
      console.log('Login successful:', formData);
      router.push('/');
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t('login.title')}
        </h1>
        <p className="text-secondary/70">
          {t('login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-6" noValidate>
        <InputField
          name="email"
          type="email"
          labelKey="Auth.fields.email"
          placeholderKey="Auth.fields.emailPlaceholder"
          value={formData.email}
          onChange={handleChange}
          errorKey={errors.email ? `Auth.${errors.email}` : undefined}
          dir="ltr"
        />

        <PasswordInput
          name="password"
          labelKey="Auth.fields.password"
          placeholderKey="Auth.fields.passwordPlaceholder"
          value={formData.password}
          onChange={handleChange}
          errorKey={errors.password ? `Auth.${errors.password}` : undefined}
          dir="ltr"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? '...' : t('login.submit')}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center text-secondary/70 text-sm mt-8">
        {t('login.noAccount')}{' '}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          {t('login.createAccount')}
        </Link>
      </p>
    </div>
  );
};
