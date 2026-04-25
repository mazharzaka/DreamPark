'use client';

import React, { useState, forwardRef, InputHTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelKey: string;
  placeholderKey?: string;
  errorKey?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ labelKey, placeholderKey, errorKey, className = '', ...props }, ref) => {
    const t = useTranslations();
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-primary">
          {t(labelKey)}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full px-4 py-3 rounded-xl bg-surface/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ltr:pr-12 rtl:pl-12 ${
              errorKey
                ? 'border-red-500 focus:border-red-500'
                : 'border-secondary/20 focus:border-primary/50'
            } ${className}`}
            placeholder={placeholderKey ? t(placeholderKey) : ''}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-secondary/50 hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errorKey && (
          <span className="text-xs text-red-500 font-medium">
            {t(errorKey)}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
