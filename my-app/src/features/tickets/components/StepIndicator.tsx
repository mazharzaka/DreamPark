'use client';

import { useTranslations, useLocale } from 'next-intl';

export function StepIndicator() {
  const t = useTranslations('Tickets');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const steps = [
    { id: '03', label: t('step03'), active: false },
    { id: '02', label: t('step02'), active: false },
    { id: '01', label: t('step01'), active: true },
  ];

  // Reverse for LTR
  const displaySteps = isRtl ? steps : [...steps].reverse();

  return (
    <div className="flex items-center justify-center gap-8 mb-16">
      {displaySteps.map((step) => (
        <div key={step.id} className="relative flex flex-col items-center">
          <span className={`text-sm font-bold transition-colors ${step.active ? 'text-primary' : 'text-primary/30'}`}>
            {step.label}
          </span>
          {step.active && (
            <div className="absolute -bottom-2 w-full h-1 bg-primary rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}
