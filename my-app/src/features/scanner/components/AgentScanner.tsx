'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  WifiOff,
  CheckCircle,
  ShieldAlert,
  Ban,
  Check,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  useVerifyScanMutation,
  useVerifyConfirmMutation,
  useVerifyCancelMutation,
} from '../../../lib/features/api/bookingsApi';

export const AgentScanner: React.FC = () => {
  const [scanMutation, { isLoading: isScanning }] = useVerifyScanMutation();
  const [confirmMutation, { isLoading: isConfirming }] = useVerifyConfirmMutation();
  const [cancelMutation, { isLoading: isCancelling }] = useVerifyCancelMutation();

  // State management
  const [isOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  // Synchronous ref lock — prevents concurrent API calls from rapid QR frames
  const isScanningRef = useRef<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // 1) Reset scanner to ready state
  // ─────────────────────────────────────────────────────────────
  const resetScanner = useCallback(() => {
    setScannedTicket(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    isScanningRef.current = false;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2) Process QR Scan event
  // ─────────────────────────────────────────────────────────────
  const handleQrScan = async (qrCodeId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await scanMutation({ qrCodeId }).unwrap();
      if (result.success && result.data?.booking) {
        setScannedTicket(result.data.booking);
      }
    } catch (err: any) {
      const errMsg = err?.data?.error || 'حدث خطأ غير متوقع أثناء الفحص';
      setErrorMsg(errMsg);
      setScannedTicket(null);

      // Auto-reset scanner after 3 seconds on error
      setTimeout(() => {
        resetScanner();
      }, 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3) onScan callback — sole entry point from <Scanner />
  // ─────────────────────────────────────────────────────────────
  const handleScan = useCallback(
    (results: { rawValue: string }[]) => {
      // Immediate synchronous lock check — no async, no race condition
      if (!results?.length || isScanningRef.current) return;

      const qrCodeId = results[0].rawValue;
      if (!qrCodeId) return;

      isScanningRef.current = true; // Lock before any async work
      handleQrScan(qrCodeId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ─────────────────────────────────────────────────────────────
  // 4) Confirm paid transition
  // ─────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    try {
      const result = await confirmMutation({ bookingId: scannedTicket.id }).unwrap();
      if (result.success) {
        setSuccessMsg(scannedTicket.visitorName);
        setScannedTicket(null);

        setTimeout(() => {
          resetScanner();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'فشل تأكيد الدفع');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5) Cancel / Release scan lock
  // ─────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    try {
      const result = await cancelMutation({ bookingId: scannedTicket.id }).unwrap();
      if (result.success) {
        resetScanner();
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'فشل إلغاء فحص التذكرة');
      resetScanner();
    }
  };

  // Derive: Scanner mounts only when online and no ticket/success is showing
  const showScanner = isOnline && !scannedTicket && !successMsg;

  // ─────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative">
      {/* 1) Connectivity Lock Layer */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-8 rounded-3xl shadow-ambient"
          >
            <div className="bg-[#b5161e]/10 p-6 rounded-full mb-6">
              <WifiOff className="w-16 h-16 text-[#b5161e] animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-on-surface mb-3 font-cairo">
              تم قطع الاتصال بالإنترنت
            </h2>
            <p className="text-on-surface/80 text-lg leading-relaxed font-cairo max-w-md">
              تم إيقاف تشغيل الكاميرا تلقائياً للحفاظ على سلامة الحسابات الميدانية.
              <br />
              <strong className="text-[#b5161e] block mt-2 text-xl font-bold">
                لا تقم بتحصيل المبالغ النقدية يدوياً!
              </strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main scanner panel */}
      <div className="bg-surface-low rounded-3xl p-6 shadow-ambient overflow-hidden relative">
        <h1 className="text-3xl font-black text-on-surface mb-6 font-cairo text-center">
          بوابة فحص التذاكر والدفع النقدي
        </h1>

        {/* 2) Success Banner */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-emerald-500/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-3" />
              <h3 className="text-xl font-bold text-on-surface font-cairo">
                تم تأكيد الدفع بنجاح!
              </h3>
              <p className="text-on-surface/80 mt-1 font-cairo">
                تم قبول الدخول للزائر: <strong>{successMsg}</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Permission Error */}
        {cameraError && (
          <p className="text-[#b5161e] bg-[#b5161e]/10 p-4 rounded-xl font-medium text-sm text-center mb-6 font-cairo">
            {cameraError}
          </p>
        )}

        {/* Business Validation Error */}
        {errorMsg && (
          <div className="bg-[#b5161e]/10 text-[#b5161e] p-4 rounded-2xl flex items-center gap-3 mb-6 font-cairo">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* 3) Scanner Camera Viewport — unmounts completely when not needed */}
        {showScanner && (
          <div className="w-full aspect-square bg-surface-lowest rounded-2xl overflow-hidden relative">
            {isScanning && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#b5161e] animate-spin" />
              </div>
            )}

            <Scanner
              onScan={handleScan}
              onError={(err) => {
                console.warn('QR Scanner error:', err);
                setCameraError('برجاء التأكد من تفعيل صلاحية الكاميرا للمتصفح');
              }}
              constraints={{ facingMode: 'environment' }}
              sound={false}
              styles={{
                container: {
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                },
                video: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px',
                },
              }}
            />
          </div>
        )}

        {/* 4) Active Scanned Ticket Lock Card */}
        <AnimatePresence>
          {scannedTicket && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-surface-lowest p-6 rounded-2xl shadow-ambient mb-6 font-cairo"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-plus-jakarta-sans uppercase">
                    {scannedTicket.status}
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-2">
                    {scannedTicket.visitorName}
                  </h3>
                  <p className="text-on-surface/60 text-sm">{scannedTicket.phoneNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-on-surface/50">المبلغ المطلوب تحصيله</span>
                  <h2 className="text-2xl font-black text-primary font-plus-jakarta-sans">
                    {scannedTicket.totalPrice.toLocaleString()} IQD
                  </h2>
                </div>
              </div>

              <div className="bg-surface-low p-4 rounded-xl space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/60">نوع التذكرة</span>
                  <span className="font-bold text-on-surface">{scannedTicket.ticketTypeName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/60">عدد التذاكر</span>
                  <span className="font-bold text-on-surface">{scannedTicket.quantity}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancel}
                  disabled={isCancelling || isConfirming}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-surface-low text-on-surface hover:bg-surface-low/80 font-bold transition disabled:opacity-50"
                >
                  <Ban className="w-5 h-5" />
                  إلغاء الفحص
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming || isCancelling}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-90 font-bold shadow-md transition disabled:opacity-50"
                >
                  {isConfirming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  تأكيد استلام النقد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
