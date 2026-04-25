'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/src/i18n/routing';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { validateEmail, validatePasswordStrict } from '../utils/validation';

export const SignupForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'errors.required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'errors.required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'errors.emailInvalid';
    }

    if (!formData.password) {
      newErrors.password = 'errors.required';
    } else {
      const passwordValidation = validatePasswordStrict(formData.password);
      if (!passwordValidation.isValid) {
        // Just show the first error for simplicity
        newErrors.password = passwordValidation.errors[0].replace('Auth.', '');
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Mock successful signup
      console.log('Signup successful:', formData);
      router.push('/');
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t('signup.title')}
        </h1>
        <p className="text-secondary/70">
          {t('signup.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-6" noValidate>
        <InputField
          name="fullName"
          labelKey="Auth.fields.fullName"
          placeholderKey="Auth.fields.fullNamePlaceholder"
          value={formData.fullName}
          onChange={handleChange}
          errorKey={errors.fullName ? `Auth.${errors.fullName}` : undefined}
        />
        
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
          {isSubmitting ? '...' : t('signup.submit')}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center text-secondary/70 text-sm mt-8">
        {t('signup.hasAccount')}{' '}
        <Link href="/login" className="text-primary font-bold hover:underline">
          {t('signup.signIn')}
        </Link>
      </p>
    </div>
  );
};
