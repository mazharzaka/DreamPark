'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { EditorialButton } from '@/src/components/ui/EditorialButton';
import { useSendOtpMutation, useVerifyAccountOTPMutation } from '@/src/lib/features/auth/authApi';

interface OtpVerificationProps {
  email: string;
  purpose?: string;
  onSuccess?: (data?: any) => void;
}

export const OtpVerification = ({ email, purpose = 'account_activation', onSuccess }: OtpVerificationProps) => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const locale = useLocale() || 'en';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyAccountOTPMutation();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();

  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (!/^[0-9]*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1); // allow only 1 digit
    setOtp(newOTP);

    if (value && index < 5) {
      setActiveOTPIndex(index + 1);
    }
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        setActiveOTPIndex(index - 1);
      }
    }
  };

  const submitOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError(t('invalidOtpLength'));
      return;
    }

    try {
      setError('');
      const response = await verifyOtp({ email, code, purpose }).unwrap();
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        router.push(`/${locale}/login`);
      }
      
    } catch (err: any) {
      const errMsg = typeof err?.data?.message === 'string' 
        ? err.data.message 
        : typeof err?.data?.error === 'string' 
          ? err.data.error 
          : t('verificationFailed');
      setError(errMsg);
      setOtp(['', '', '', '', '', '']);
      setActiveOTPIndex(0);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await sendOtp({ email, purpose }).unwrap();
      setCountdown(60);
      setError('');
    } catch (err: any) {
      const errMsg = typeof err?.data?.message === 'string' 
        ? err.data.message 
        : typeof err?.data?.error === 'string' 
          ? err.data.error 
          : t('resendFailed');
      setError(errMsg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center max-w-md mx-auto w-full p-8 bg-surface-container-lowest rounded-xl shadow-ambient"
    >
      <h2 className="text-3xl font-bold mb-2">{t('verifyEmail')}</h2>
      <p className="text-on-surface/70 text-center mb-8">
        {t('otpSentTo', { email })}
      </p>

      <div className="flex justify-center gap-2 mb-8">
        {otp.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <input
              ref={index === activeOTPIndex ? inputRef : null}
              type="text"
              className="w-12 h-14 border border-outline-variant/20 rounded-xl text-center text-2xl font-bold bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
              onChange={(e) => handleOnChange(e, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              value={otp[index]}
              maxLength={1}
            />
          </motion.div>
        ))}
      </div>

      {error && <p className="text-primary mb-4 text-sm">{error}</p>}

      <div className="w-full">
        <EditorialButton
          variant="primary"
          onClick={submitOtp}
          disabled={isVerifying || otp.join('').length < 6}
          className="w-full py-4 text-lg"
        >
          {isVerifying ? t('verifying') : t('verify')}
        </EditorialButton>
      </div>

      <div className="mt-6 text-sm flex gap-2">
        <span className="text-on-surface/70">{t('didNotReceive')}</span>
        <button
          onClick={handleResend}
          disabled={!canResend || isSending}
          className="text-secondary font-semibold disabled:text-on-surface/40 hover:underline"
        >
          {canResend
            ? t('resend')
            : t('resendIn', { time: `00:${countdown.toString().padStart(2, '0')}` })}
        </button>
      </div>
    </motion.div>
  );
};
