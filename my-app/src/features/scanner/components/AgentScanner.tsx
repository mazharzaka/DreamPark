'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { WifiOff, AlertTriangle, CheckCircle, ShieldAlert, Ban, Check, Loader2 } from 'lucide-react';
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
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  // Scanner reference
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // 1) Handle real-time network connectivity status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setErrorMsg(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Revert any scanned ticket since we are offline and can't proceed securely
      setScannedTicket(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2) Initialize QR Code scanner reactively based on network connectivity and active ticket/success states
  useEffect(() => {
    if (!isOnline) return;
    if (scannedTicket || successMsg) return;

    // Wait a brief tick for DOM element availability and potential exit transitions
    const delay = setTimeout(() => {
      const element = document.getElementById('qr-reader-viewport');
      if (!element) {
        console.warn('qr-reader-viewport element not found in DOM, skipping scanner initialization.');
        return;
      }

      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader-viewport',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [0], // 0 is HTML5QrcodeScanType.SCAN_TYPE_CAMERA
          },
          /* verbose= */ false
        );

        scannerRef.current = scanner;

        scanner.render(
          async (decodedText) => {
            // Triggered on scan success
            await handleQrScan(decodedText);
          },
          (errorMessage) => {
            // Quietly ignore frame failures to prevent log spam
            
          }
        );
      } catch (err) {
        console.error('QR Init Error:', err);
  
  // ✅ الحل: حفظ رسالة نصية صريحة وليس الـ Object كامل لحماية الـ JSX
  setError({
    status: "error",
    statusCode: 500,
    message: "برجاء التأكد من تفعيل صلاحية الكاميرا للمتصفح"
  });
      }
    }, 200); // 200ms delay to let AnimatePresence and React state batching complete safely

    return () => {
      clearTimeout(delay);
      if (scannerRef.current) {
        const scannerToClear = scannerRef.current;
        scannerRef.current = null;
        scannerToClear.clear().catch((err) => {
          console.warn('Failed to clear scanner on state change or unmount:', err);
        });
      }
    };
  }, [isOnline, scannedTicket, successMsg]);

  // 3) Process QR Scan event
  const handleQrScan = async (qrCodeId: string) => {
    if (scannedTicket) return; // Prevent scanning again if we have a locked ticket already
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

  // 4) Reset scanner to ready state
  const resetScanner = () => {
    setScannedTicket(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // 5) Confirm paid transition
  const handleConfirm = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    try {
      const result = await confirmMutation({ bookingId: scannedTicket.id }).unwrap();
      if (result.success) {
        setSuccessMsg(scannedTicket.visitorName);
        setScannedTicket(null);

        // Auto reset scanner after 2 seconds success flash
        setTimeout(() => {
          resetScanner();
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'فشل تأكيد الدفع');
    }
  };

  // 6) Cancel/Release scan lock
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
      // Force local reset anyway on fail
      resetScanner();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative">
      {/* 1) Dynamic Connectivity Lock Layer */}
      {error && <p className="text-crimson font-medium">{error.message}</p>}
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

        {/* 2) Inline Success Indicator */}
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

        {/* Errors display */}
        {errorMsg && (
          <div className="bg-[#b5161e]/10 text-[#b5161e] p-4 rounded-2xl flex items-center gap-3 mb-6 font-cairo">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p className="font-medium text-sm leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* 3) Scanner Camera Viewport */}
        {!scannedTicket && !successMsg && (
          <div className="w-full aspect-square bg-surface-lowest rounded-2xl overflow-hidden relative flex items-center justify-center">
            {isScanning && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#b5161e] animate-spin" />
              </div>
            )}
            <div id="qr-reader-viewport" className="w-full h-full object-cover rounded-2xl" />
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

              {/* Tonal detail listing */}
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

              {/* Action buttons with strict rounded-full and linear gradient */}
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
