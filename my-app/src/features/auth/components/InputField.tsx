import React, { InputHTMLAttributes, forwardRef } from 'react';
import { useTranslations } from 'next-intl';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelKey: string;
  placeholderKey?: string;
  errorKey?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ labelKey, placeholderKey, errorKey, className = '', ...props }, ref) => {
    const t = useTranslations();

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-primary">
          {t(labelKey)}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-surface/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errorKey
                ? 'border-red-500 focus:border-red-500'
                : 'border-secondary/20 focus:border-primary/50'
            } ${className}`}
            placeholder={placeholderKey ? t(placeholderKey) : ''}
            {...props}
          />
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

InputField.displayName = 'InputField';
