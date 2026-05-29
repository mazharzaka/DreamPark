"use client";

import React, { useState, useRef, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  WifiOff,
  ShieldAlert,
  CheckCircle,
  Ban,
  Check,
  Loader2,
  User,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useVerifyScanMutation,
  useVerifyConfirmMutation,
  useVerifyCancelMutation,
} from "@/src/lib/features/api/bookingsApi";

interface AgentScannerClientProps {
  user: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
}

export default function AgentScannerClient({ user }: AgentScannerClientProps) {
  // RTK mutations
  const [scanMutation, { isLoading: isScanning }] = useVerifyScanMutation();
  const [confirmMutation, { isLoading: isConfirming }] =
    useVerifyConfirmMutation();
  const [cancelMutation, { isLoading: isCancelling }] =
    useVerifyCancelMutation();

  // State
  const [isOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Ref lock — synchronous gatekeeper, survives re-renders, reset only on explicit reset
  const isScanningRef = useRef<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // 1) Reset all state → scanner remounts automatically via conditional render
  // ─────────────────────────────────────────────────────────────
  const resetScanner = useCallback(() => {
    setScannedTicket(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    isScanningRef.current = false;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2) Handle scanned QR code
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
      const errMsg = err?.data?.error || "حدث خطأ غير متوقع أثناء الفحص";
      setErrorMsg(errMsg);
      setScannedTicket(null);

      // After 3 seconds: reset lock + state → Scanner remounts for a fresh scan
      setTimeout(() => {
        resetScanner();
      }, 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3) onScan callback — the ONLY entry point from the scanner
  // ─────────────────────────────────────────────────────────────
  const handleScan = useCallback(
    (results: { rawValue: string }[]) => {
      // Guard: must have a result and no in-flight request
      if (!results?.length || isScanningRef.current) return;

      const qrCodeId = results[0].rawValue;
      if (!qrCodeId) return;

      // Lock immediately (synchronous — before any async work)
      isScanningRef.current = true;

      handleQrScan(qrCodeId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ─────────────────────────────────────────────────────────────
  // 4) Confirm cash payment
  // ─────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    try {
      const result = await confirmMutation({
        bookingId: scannedTicket.id,
      }).unwrap();
      if (result.success) {
        setSuccessMsg(scannedTicket.visitorName);
        setScannedTicket(null);

        // Flash success 2.5s then reset → Scanner remounts
        setTimeout(() => {
          resetScanner();
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || "فشل تأكيد استلام النقدية");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 5) Cancel current scan lock
  // ─────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!scannedTicket) return;
    setErrorMsg(null);

    try {
      const result = await cancelMutation({
        bookingId: scannedTicket.id,
      }).unwrap();
      if (result.success) {
        resetScanner();
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || "فشل إلغاء حظر التذكرة");
      resetScanner();
    }
  };

  // Derive: should the Scanner be mounted?
  const showScanner = isOnline && !scannedTicket && !successMsg;

  // ─────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative font-cairo">
      {/* Connectivity Interceptor Overlay */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#f6f6f6]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-8 rounded-3xl"
          >
            <div className="bg-[#b5161e]/10 p-6 rounded-full mb-6">
              <WifiOff className="w-16 h-16 text-[#b5161e] animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-[#2d2f2f] mb-3">
              تم انقطاع الاتصال بالإنترنت
            </h2>
            <p className="text-[#2d2f2f]/80 text-lg leading-relaxed max-w-md">
              تم إيقاف تشغيل الكاميرا تلقائياً لضمان سلامة الدفع والتدقيق
              المالي الميداني.
              <br />
              <strong className="text-[#b5161e] block mt-2 text-xl font-bold">
                تنبيه: لا تقم بقبول أي رسوم يدوية بدون اتصال!
              </strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(45,47,47,0.04)] overflow-hidden relative">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 gap-4 text-center">
          <div className="bg-[#f0f1f1] px-5 py-2 rounded-full flex items-center gap-2">
            <User className="w-4 h-4 text-[#005caa]" />
            <span className="text-[#2d2f2f] text-sm font-bold">
              {user.name} (
              {user.role === "ADMIN" ? "مسؤول النظام" : "وكيل تسويق"})
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#2d2f2f] leading-tight">
            بوابة الفحص السريع والدفع النقدي
          </h1>
          <p className="text-[#2d2f2f]/60 text-sm max-w-md">
            قم بمحاذاة الرمز التعريفي للتذكرة أمام الكاميرا لتأكيد الحجز
            وتسهيل الدخول.
          </p>
        </div>

        {/* Camera Permission Error */}
        {error && (
          <div className="mb-6">
            <p className="text-[#b5161e] bg-[#f0f1f1] p-4 rounded-xl font-bold text-center text-sm leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {/* Business Validation Error */}
        {errorMsg && (
          <div className="bg-[#b5161e]/10 text-[#b5161e] p-5 rounded-2xl flex items-start gap-4 mb-6">
            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="font-semibold text-sm leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success Banner */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#10b981]/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-[#10b981] mb-4" />
              <h3 className="text-xl font-bold text-[#2d2f2f]">
                تم تأكيد الدفع والعبور بنجاح!
              </h3>
              <p className="text-[#2d2f2f]/80 mt-2 text-sm">
                مرحباً بالزائر:{" "}
                <strong className="text-[#10b981]">{successMsg}</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Camera Viewport ─────────────────────────────── */}
        {showScanner && (
          <div className="w-full aspect-square bg-[#f6f6f6] rounded-2xl overflow-hidden relative">
            {/* API loading overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-[#ffffff]/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <Loader2 className="w-12 h-12 text-[#b5161e] animate-spin" />
              </div>
            )}

            {/* @yudiel/react-qr-scanner — native React, clean lifecycle */}
            <Scanner
              onScan={handleScan}
              onError={(err) => {
                console.warn("QR Scanner error:", err);
                setError("برجاء التأكد من تفعيل صلاحية الكاميرا للمتصفح");
              }}
              constraints={{ facingMode: "environment" }}
              components={{ audio: false }}
              styles={{
                container: {
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                },
                video: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                },
              }}
            />
          </div>
        )}

        {/* Offline scanner placeholder */}
        {!isOnline && !scannedTicket && !successMsg && (
          <div className="w-full aspect-square bg-[#f6f6f6] rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f0f1f1] flex items-center justify-center">
              <Camera className="w-8 h-8 text-[#005caa]" />
            </div>
            <p className="text-[#2d2f2f]/70 text-sm font-semibold">
              يرجى استعادة الاتصال بالإنترنت لبدء تشغيل ماسح البوابة
            </p>
          </div>
        )}

        {/* ── Scanned Ticket Card ──────────────────────────── */}
        <AnimatePresence>
          {scannedTicket && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-[#f6f6f6] p-6 rounded-2xl mb-6 shadow-none"
            >
              {/* Visitor & pricing metadata */}
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <span className="bg-[#005caa]/10 text-[#005caa] px-3.5 py-1 rounded-full text-xs font-bold font-sans uppercase">
                    {scannedTicket.status}
                  </span>
                  <h3 className="text-xl font-bold text-[#2d2f2f] mt-3">
                    {scannedTicket.visitorName}
                  </h3>
                  <p className="text-[#2d2f2f]/60 text-sm mt-1">
                    {scannedTicket.phoneNumber}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#2d2f2f]/50">
                    المبلغ المطلوب للتحصيل
                  </span>
                  <h2 className="text-2xl font-black text-[#b5161e] font-sans mt-1">
                    {scannedTicket.totalPrice.toLocaleString()} IQD
                  </h2>
                </div>
              </div>

              {/* Ticket details */}
              <div className="bg-[#ffffff] p-5 rounded-2xl space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d2f2f]/60 font-semibold">
                    فئة التذكرة
                  </span>
                  <span className="font-bold text-[#2d2f2f]">
                    {scannedTicket.ticketTypeName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d2f2f]/60 font-semibold">
                    عدد الأفراد
                  </span>
                  <span className="font-bold text-[#2d2f2f]">
                    {scannedTicket.quantity} فرد
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancel}
                  disabled={isCancelling || isConfirming}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#f0f1f1] text-[#2d2f2f] hover:bg-[#e4e5e5] font-bold transition duration-200 disabled:opacity-50"
                >
                  <Ban className="w-5 h-5" />
                  إلغاء الفحص
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming || isCancelling}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-gradient-to-r from-[#b5161e] to-[#ff766d] text-white hover:opacity-90 font-bold transition duration-200 shadow-none disabled:opacity-50"
                >
                  {isConfirming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  تأكيد استلام النقدية
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
