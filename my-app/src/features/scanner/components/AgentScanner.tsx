'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  WifiOff,
  CheckCircle,
  ShieldAlert,
  Ban,
  Check,
  Loader2,
  Camera,
  Coins,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  useVerifyScanMutation,
  useVerifyConfirmMutation,
  useVerifyCancelMutation,
} from '../../../lib/features/api/bookingsApi';
import { useAuth } from '../../../lib/features/auth/AuthContext';

export const AgentScanner: React.FC = () => {
  const [scanMutation, { isLoading: isScanning }] = useVerifyScanMutation();
  const [confirmMutation, { isLoading: isConfirming }] = useVerifyConfirmMutation();
  const [cancelMutation, { isLoading: isCancelling }] = useVerifyCancelMutation();
  const { user, logout } = useAuth();

  // ─────────────────────────────────────────────────────────────
  // 1) State & Ref Lock Management
  // ─────────────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isShiftOpen, setIsShiftOpen] = useState<boolean>(false);

  // Synchronous lock ref to prevent concurrent frames from triggering API calls
  const isScanningRef = useRef<boolean>(false);
  const scannerRef = useRef<any>(null);

  // Persistent Shift stats in LocalStorage to safeguard against reloads
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dream_shift_bookings_count');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [totalCashExpected, setTotalCashExpected] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dream_shift_cash_expected');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Sync network status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save stats to LocalStorage
  useEffect(() => {
    localStorage.setItem('dream_shift_bookings_count', activeBookingsCount.toString());
  }, [activeBookingsCount]);

  useEffect(() => {
    localStorage.setItem('dream_shift_cash_expected', totalCashExpected.toString());
  }, [totalCashExpected]);


  // ─────────────────────────────────────────────────────────────
  // 2) QR Scanning & Frame Lock logic
  // ─────────────────────────────────────────────────────────────
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz crisp beep sound
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // moderate volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12); // quick decay

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn('Failed to play audio scan beep:', e);
    }
  };

  const handleQrScan = async (qrCodeId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Freeze camera frames immediately upon scanning to prevent Ghost Scans
    if (scannerRef.current) {
      try {
        scannerRef.current.pause(true);
      } catch (e) {
        console.warn('Failed to pause scanner ref:', e);
      }
    }

    try {
      const result = await scanMutation({ qrCodeId }).unwrap();
      if (result.success && result.data?.booking) {
        setScannedTicket(result.data.booking);
      } else {
        throw new Error('فشل الحصول على بيانات الحجز');
      }
    } catch (err: any) {
      const errMsg = typeof err === 'string'
        ? err
        : err?.data?.error || err?.message || 'حدث خطأ غير متوقع أثناء الفحص';

      setErrorMsg(errMsg);
      setScannedTicket(null);
    }
  };

  const handleScan = useCallback(
    (results: { rawValue: string }[]) => {
      // Synchronous gatekeeper lock
      if (!results?.length || isScanningRef.current) return;

      const qrCodeId = results[0].rawValue;
      if (!qrCodeId) return;

      // Play scanner beep
      playBeep();

      isScanningRef.current = true;
      handleQrScan(qrCodeId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ─────────────────────────────────────────────────────────────
  // 3) Confirmation (Optimistic Shift Update)
  // ─────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    const bookingId = scannedTicket.id;
    const cashAmount = scannedTicket.totalPrice;

    // Cache original state for fallback rollback
    const originalCash = totalCashExpected;
    const originalCount = activeBookingsCount;

    // Optimistically increment local shift counters
    setTotalCashExpected((prev) => prev + cashAmount);
    setActiveBookingsCount((prev) => prev + 1);

    const visitorName = scannedTicket.visitorName;

    // Close bottom sheet immediately
    setScannedTicket(null);

    try {
      const result = await confirmMutation({ bookingId }).unwrap();
      if (result.success) {
        setSuccessMsg(visitorName);

        // Flash success overlay briefly before resetting frame lock
        setTimeout(() => {
          setSuccessMsg(null);
          if (scannerRef.current) {
            try {
              scannerRef.current.resume();
            } catch (e) {
              console.warn('Failed to resume scanner:', e);
            }
          }
          isScanningRef.current = false;
        }, 2000);
      }
    } catch (err: any) {
      // Rollback optimistic state changes upon mutation failure
      setTotalCashExpected(originalCash);
      setActiveBookingsCount(originalCount);

      const errMsg = typeof err === 'string'
        ? err
        : err?.data?.error || err?.message || 'فشل تأكيد استلام النقدية';

      setErrorMsg(errMsg);
      isScanningRef.current = false;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 4) Cancel Scan Lock (No Mutations)
  // ─────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    const bookingId = scannedTicket.id;
    setScannedTicket(null);

    try {
      await cancelMutation({ bookingId }).unwrap();
    } catch (err: any) {
      console.warn('Backend ticket lock release failed:', err);
    } finally {
      // Safely resume camera scanner frame evaluations without state modification
      if (scannerRef.current) {
        try {
          scannerRef.current.resume();
        } catch (e) {
          console.warn('Failed to resume scanner:', e);
        }
      }
      isScanningRef.current = false;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5) Failure State Resolution (Retry)
  // ─────────────────────────────────────────────────────────────
  const handleFailureRetry = () => {
    setErrorMsg(null);
    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch (e) {
        console.warn('Failed to resume scanner:', e);
      }
    }
    isScanningRef.current = false;
  };

  // ─────────────────────────────────────────────────────────────
  // 6) Daily Shift Cleanup & Handover
  // ─────────────────────────────────────────────────────────────
  const handleShiftHandover = async () => {
    localStorage.removeItem('dream_shift_bookings_count');
    localStorage.removeItem('dream_shift_cash_expected');
    setActiveBookingsCount(0);
    setTotalCashExpected(0);
    setIsShiftOpen(false);
    await logout();
  };

  // Condition to mount native camera viewport
  const showScanner = isOnline && !scannedTicket && !successMsg && !errorMsg;

  // ─────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 relative font-cairo select-none">
      
      {/* ────────────────────────────────────────────────────────
          A. THE SHIFT REPORT SUMMARY (Top-Corner Panel)
          ──────────────────────────────────────────────────────── */}
      <div className="absolute top-0 right-6 z-30">
        <button
          onClick={() => setIsShiftOpen(!isShiftOpen)}
          className="bg-[#f0f1f1] text-[#005caa] hover:bg-[#e4e5e5] rounded-full px-5 py-2.5 font-bold transition duration-200 text-sm shadow-none border-none outline-none flex items-center gap-2"
        >
          <Coins className="w-4 h-4" />
          <span>تقرير الوردية</span>
        </button>

        <AnimatePresence>
          {isShiftOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-12 right-0 w-80 bg-white shadow-[0_40px_80px_rgba(45,47,47,0.06)] rounded-3xl p-6 text-right z-50 border-none"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-end mb-2 pb-2">
                  <span className="text-sm font-black text-[#2d2f2f]">ملخص الوردية الحالية</span>
                </div>

                <div className="py-4 border-none bg-[#f6f6f6] rounded-2xl px-4 text-right">
                  <p className="text-[#2d2f2f]/60 text-xs font-semibold">إجمالي الحجوزات المفعلة اليوم</p>
                  <p className="text-2xl font-black text-[#005caa] mt-1 font-plus-jakarta-sans">
                    {activeBookingsCount} <span className="text-xs font-bold font-cairo">حجز</span>
                  </p>
                </div>

                <div className="py-4 border-none bg-[#f6f6f6] rounded-2xl px-4 text-right">
                  <p className="text-[#2d2f2f]/60 text-xs font-semibold">إجمالي الكاش المتوقع بالخزينة</p>
                  <p className="text-2xl font-black text-[#b5161e] mt-1 font-plus-jakarta-sans">
                    {totalCashExpected.toLocaleString()}{' '}
                    <span className="text-xs font-bold font-cairo">جنيه</span>
                  </p>
                </div>

                <button
                  onClick={handleShiftHandover}
                  className="w-full mt-6 py-4 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-95 font-bold transition duration-200 text-sm shadow-none border-none outline-none"
                >
                  إغلاق الوردية وتسليم العهدة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ────────────────────────────────────────────────────────
          B. MAIN VIEWPORT CONTAINER
          ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[32px] p-8 shadow-[0_40px_80px_rgba(45,47,47,0.06)] overflow-hidden relative text-center">
        {/* Header section with User Info */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="bg-[#f0f1f1] px-5 py-2.5 rounded-full flex items-center gap-2">
            <User className="w-4 h-4 text-[#005caa]" />
            <span className="text-[#2d2f2f] text-xs font-black">
              {user?.name || 'وكيل البوابة'} (
              {user?.role === 'ADMIN' ? 'مسؤول النظام' : 'وكيل البوابة'})
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#2d2f2f] leading-tight font-cairo">
            بوابة الفحص والدفع النقدي
          </h1>
          <p className="text-[#2d2f2f]/60 text-sm max-w-sm font-cairo">
            وجه الرمز التعريفي (QR Code) للتذكرة نحو الكاميرا لتأكيد الحجز والدخول.
          </p>
        </div>

        {/* Camera Permission Errors */}
        {cameraError && (
          <div className="mb-6">
            <p className="text-[#b5161e] bg-[#b5161e]/5 p-4 rounded-2xl font-bold text-center text-sm leading-relaxed">
              {cameraError}
            </p>
          </div>
        )}

        {/* 1) Camera Viewport Area */}
        <div className="w-full aspect-square bg-[#f6f6f6] rounded-3xl overflow-hidden relative">
          {/* RTK Scanning frame loading overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
              <Loader2 className="w-12 h-12 text-[#b5161e] animate-spin" />
            </div>
          )}

          {showScanner && (
            <Scanner
              ref={scannerRef}
              onScan={handleScan}
              onError={(err) => {
                console.warn('QR Scanner error:', err);
                setCameraError('يرجى التأكد من توفير صلاحيات الكاميرا للمتصفح.');
              }}
              constraints={{ facingMode: 'environment' }}
              sound={false}
              styles={{
                container: {
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                },
                video: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                },
              }}
            />
          )}

          {/* Offline scanning blocker */}
          {!isOnline && !scannedTicket && !successMsg && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
              <div className="bg-[#b5161e]/10 p-5 rounded-full">
                <WifiOff className="w-12 h-12 text-[#b5161e] animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2f2f]">انقطع الاتصال بالشبكة</h3>
              <p className="text-[#2d2f2f]/60 text-sm max-w-xs leading-relaxed">
                تم إيقاف تشغيل الكاميرا تلقائياً للحفاظ على سلامة الحسابات والتدقيق المالي الميداني.
              </p>
            </div>
          )}

          {/* Success Flash Feedback */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#10b981]/5 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="bg-[#10b981]/15 p-6 rounded-full mb-4">
                  <Check className="w-12 h-12 text-[#10b981]" />
                </div>
                <h3 className="text-2xl font-black text-[#2d2f2f]">تم قبول الدخول بنجاح!</h3>
                <p className="text-[#2d2f2f]/70 text-sm mt-2">
                  مرحباً بالزائر:{' '}
                  <strong className="text-[#10b981]">
                    {typeof successMsg === 'string' ? successMsg : ''}
                  </strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          C. THE RESULT SHEET OVERLAY (Framer Motion Bottom Sheet)
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {scannedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2d2f2f]/40 backdrop-blur-md z-40 flex items-end justify-center"
          >
            {/* Click backdrop to close safely */}
            <div className="absolute inset-0" onClick={handleCancel} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-white rounded-t-[36px] p-8 shadow-[0_-20px_60px_rgba(45,47,47,0.06)] relative z-50 text-right font-cairo border-none"
            >
              {/* Overlay handle indicator */}
              <div className="w-12 h-1.5 bg-[#f0f1f1] rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-8 gap-6">
                <div>
                  <span className="bg-[#005caa]/10 text-[#005caa] px-3.5 py-1.5 rounded-full text-xs font-bold font-plus-jakarta-sans tracking-wide uppercase">
                    {typeof scannedTicket.status === 'string' ? scannedTicket.status : ''}
                  </span>
                  <h2 className="text-2xl font-black text-[#2d2f2f] mt-4">
                    {typeof scannedTicket.visitorName === 'string' ? scannedTicket.visitorName : ''}
                  </h2>
                  <p className="text-[#2d2f2f]/60 text-sm mt-1 font-plus-jakarta-sans">
                    {typeof scannedTicket.phoneNumber === 'string' ? scannedTicket.phoneNumber : ''}
                  </p>
                </div>
                <div className="text-left">
                  <span className="text-xs text-[#2d2f2f]/50 font-bold block mb-1">المبلغ المطلوب تحصيله</span>
                  <h2 className="text-3xl font-black text-[#b5161e] font-plus-jakarta-sans tracking-tight">
                    {typeof scannedTicket.totalPrice === 'number'
                      ? scannedTicket.totalPrice.toLocaleString()
                      : 0}{' '}
                    <span className="text-lg font-bold font-cairo">جنيه مصري</span>
                  </h2>
                </div>
              </div>

              {/* Tonal details block */}
              <div className="bg-[#f6f6f6] p-6 rounded-2xl space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#2d2f2f]/60 font-semibold">فئة التذكرة (Ticket Type)</span>
                  <span className="font-bold text-[#2d2f2f]">
                    {typeof scannedTicket.ticketTypeName === 'string' ? scannedTicket.ticketTypeName : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#2d2f2f]/60 font-semibold">عدد التذاكر / الأفراد</span>
                  <span className="font-bold text-[#2d2f2f]">
                    {typeof scannedTicket.quantity === 'number' ? scannedTicket.quantity : 0} فرد
                  </span>
                </div>
              </div>

              {/* Action grid (no borders, rounded-full) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancel}
                  disabled={isCancelling || isConfirming}
                  className="flex items-center justify-center gap-2 py-4.5 px-6 rounded-full bg-[#f0f1f1] text-[#2d2f2f] hover:bg-[#e4e5e5] font-bold transition duration-200 text-base shadow-none border-none outline-none disabled:opacity-50"
                >
                  <Ban className="w-5 h-5" />
                  <span>إلغاء الفحص</span>
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={isConfirming || isCancelling}
                  className="flex items-center justify-center gap-2 py-4.5 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-90 font-bold transition duration-200 text-base shadow-none border-none outline-none disabled:opacity-50"
                >
                  {isConfirming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span>تأكيد استلام النقدية</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          D. THE FAILURE STATE (Soft Crimson Overlay)
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#b5161e]/10 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_40px_80px_rgba(45,47,47,0.06)] text-center flex flex-col items-center justify-center border-none"
            >
              <div className="bg-[#b5161e]/10 p-5 rounded-full mb-6">
                <ShieldAlert className="w-12 h-12 text-[#b5161e]" />
              </div>
              <h3 className="text-xl font-black text-[#2d2f2f] mb-4">فشل فحص التذكرة</h3>
              <p className="text-[#2d2f2f]/80 text-sm leading-relaxed mb-8 max-w-xs">
                {typeof errorMsg === 'string' ? errorMsg : 'حدث خطأ غير متوقع أثناء الفحص'}
              </p>
              <button
                onClick={handleFailureRetry}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white font-bold hover:opacity-90 transition duration-200 text-base shadow-none border-none outline-none"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
