"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Keyboard, CheckCircle, AlertTriangle, Search, 
  DollarSign, ShieldAlert, ArrowRight, Loader2, X, Sparkles, RefreshCw 
} from "lucide-react";
import { useVerifyAndConfirmPaymentMutation } from "@/src/lib/features/api/bookingsApi";
import { useLocale, useTranslations } from "next-intl";

export default function AgentScanner() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("Dashboard");

  // Local state
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera");
  const [qrCodeInput, setQrCodeInput] = useState<string>("");
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>("");
  const [bookingIdInput, setBookingIdInput] = useState<string>("");

  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader-element";

  // RTK Mutation
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyAndConfirmPaymentMutation();

  // Initialize and clean up Html5Qrcode scanner
  useEffect(() => {
    if (activeTab === "camera" && !scannerActive && typeof window !== "undefined") {
      // Small timeout to ensure element exists in DOM
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else if (activeTab !== "camera") {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [activeTab]);

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5Qrcode = new Html5Qrcode(scannerId);
      scannerRef.current = html5Qrcode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5Qrcode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleVerifyRequest({ qrCodeId: decodedText });
          // Stop scanning on success to prevent multiple triggers
          stopScanner();
        },
        (errorMessage) => {
          // Silent scan failure logging
        }
      );
      setScannerActive(true);
      setScanError(null);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setScanError(isAr ? "فشل فتح الكاميرا. يرجى تفعيل الصلاحيات." : "Camera access denied. Please grant permissions.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    scannerRef.current = null;
    setScannerActive(false);
  };

  // Centralized payment verification requester
  const handleVerifyRequest = async (payload: { qrCodeId?: string; phoneNumber?: string; bookingId?: string }) => {
    setScanResult(null);
    setScanError(null);

    try {
      const response = await verifyPayment(payload).unwrap();
      if (response?.success) {
        setScanResult(response.data);
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const errMsg = err?.data?.message || err?.data?.error?.message || (typeof err?.data?.error === 'string' ? err?.data?.error : null) || (isAr ? "فشل التحقق من الحجز. يرجى التأكد من البيانات أو تاريخ التذكرة." : "Failed to verify pass. Ensure valid date/inputs.");
      setScanError(errMsg);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumberInput.trim()) {
      handleVerifyRequest({ phoneNumber: phoneNumberInput.trim() });
    } else if (bookingIdInput.trim()) {
      handleVerifyRequest({ bookingId: bookingIdInput.trim() });
    } else if (qrCodeInput.trim()) {
      handleVerifyRequest({ qrCodeId: qrCodeInput.trim() });
    }
  };

  const resetVerificationState = () => {
    setScanResult(null);
    setScanError(null);
    setQrCodeInput("");
    setPhoneNumberInput("");
    setBookingIdInput("");
    if (activeTab === "camera") {
      startScanner();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      {/* Visual Header Banner */}
      <div className="bg-secondary text-white rounded-[2.5rem] p-8 mb-8 shadow-ambient flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="space-y-2 text-center md:text-right rtl:text-right">
          <span className="bg-white/10 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest text-[#ffcc00] inline-block">
            {isAr ? "لوحة الموظف وبوابة الدخول" : "Staff Gate Verification Board"}
          </span>
          <h2 className="text-3xl font-black font-sans leading-tight">
            {isAr ? "ماسح التحقق السريع" : "Magic Pass Gate Scanner"}
          </h2>
          <p className="text-white/70 text-sm max-w-lg font-semibold leading-relaxed">
            {isAr 
              ? "استخدم الكاميرا لمسح ممر الزوار أو استخدم البحث اليدوي لتأكيد استلام النقدية ودخول الحديقة فوراً."
              : "Scan guest passes with your camera or search by phone/booking ID to process cash payments instantly."}
          </p>
        </div>

        <div className="mt-6 md:mt-0 bg-white/10 p-5 rounded-[2rem] flex items-center gap-4">
          <div className="text-center">
            <span className="block text-xs uppercase font-extrabold text-white/50">{isAr ? "حالة الكاميرا" : "Camera Feed"}</span>
            <span className="text-sm font-black text-white flex items-center justify-center gap-1.5 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${scannerActive ? "bg-emerald-400" : "bg-red-400"}`} />
              {scannerActive ? (isAr ? "نشط" : "Online") : (isAr ? "مغلق" : "Offline")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SCANNER CONTAINER (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-6 md:p-8 shadow-ambient space-y-6">
          {/* CONTROL TABS */}
          <div className="bg-[#f0f1f1] p-1 rounded-full flex gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab("camera")}
              className={`flex-1 py-4.5 rounded-full font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "camera" 
                  ? "bg-white text-secondary shadow-ambient" 
                  : "text-on-surface/60 hover:text-on-surface"
              }`}
            >
              <Camera className="w-4 h-4" />
              {isAr ? "مسح بالكاميرا" : "Camera QR Scan"}
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-4.5 rounded-full font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "manual" 
                  ? "bg-white text-secondary shadow-ambient" 
                  : "text-on-surface/60 hover:text-on-surface"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              {isAr ? "بحث يدوي كبديل" : "Manual Alphanumeric"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "camera" ? (
              <motion.div
                key="cameraTab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {/* Glowing camera frame */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#2d2f2f] shadow-inner flex flex-col items-center justify-center min-h-[320px]">
                  
                  {/* QR Box Indicator Overlay */}
                  <div className="absolute z-10 w-60 h-60 border-[3px] border-secondary/50 rounded-[2rem] pointer-events-none flex items-center justify-center animate-pulse">
                    <div className="w-2.5 h-2.5 bg-secondary rounded-full absolute -top-1.5" />
                    <div className="w-2.5 h-2.5 bg-secondary rounded-full absolute -bottom-1.5" />
                  </div>

                  {/* HTML5QRCODE Target Element */}
                  <div id={scannerId} className="w-full h-full overflow-hidden" />
                  
                  {!scannerActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-[#2d2f2f]/85 p-6 text-center space-y-4">
                      <Camera className="w-12 h-12 text-secondary animate-pulse" />
                      <p className="text-sm font-semibold">{isAr ? "يرجى السماح بالوصول للكاميرا لبدء المسح" : "Click below to initialize the gate scanner"}</p>
                      <button
                        onClick={startScanner}
                        className="bg-secondary text-white rounded-full px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-secondary/95 transition-all"
                      >
                        {isAr ? "تشغيل الكاميرا" : "Start Live Feed"}
                      </button>
                    </div>
                  )}
                </div>

                {scannerActive && (
                  <div className="flex justify-between items-center text-xs text-on-surface/50 font-bold px-4">
                    <span>{isAr ? "قم بمحاذاة الرمز السريع بمنتصف الإطار" : "Center the guest's QR code in the box"}</span>
                    <button 
                      onClick={startScanner}
                      className="text-secondary hover:underline flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {isAr ? "إعادة تشغيل" : "Reset Camera"}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="manualTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                <form onSubmit={handleManualSearch} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface/70">
                      {isAr ? "رقم الهاتف المسجل بالطلب" : "Registered Phone Number"}
                    </label>
                    <input
                      type="tel"
                      placeholder={isAr ? "مثال: 01xxxxxxxxx" : "e.g. 01xxxxxxxxx"}
                      value={phoneNumberInput}
                      onChange={(e) => {
                        setPhoneNumberInput(e.target.value);
                        setBookingIdInput("");
                        setQrCodeInput("");
                      }}
                      className="w-full bg-[#f0f1f1] border-none rounded-2xl p-4.5 text-on-surface font-sans text-base focus:ring-4 focus:ring-secondary/15 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-on-surface/10"></div>
                    <span className="flex-shrink mx-4 text-xs text-on-surface/40 uppercase font-black">{isAr ? "أو" : "OR"}</span>
                    <div className="flex-grow border-t border-on-surface/10"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface/70">
                      {isAr ? "رمز التحقق أو كود الحجز اليدوي" : "Verification QR ID / Booking UUID"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                      value={bookingIdInput || qrCodeInput}
                      onChange={(e) => {
                        setBookingIdInput(e.target.value);
                        setPhoneNumberInput("");
                      }}
                      className="w-full bg-[#f0f1f1] border-none rounded-2xl p-4.5 text-on-surface font-mono text-sm focus:ring-4 focus:ring-secondary/15 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || (!phoneNumberInput && !bookingIdInput && !qrCodeInput)}
                    className="w-full bg-secondary text-white py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(0,92,170,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {isAr ? "البحث والتحقق من التذكرة" : "Search & Verify Pass"}
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VERIFICATION PANEL SUMMARY (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {scanResult ? (
              <motion.div
                key="result"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white rounded-[3rem] p-8 shadow-ambient space-y-8 relative overflow-hidden"
              >
                {/* Visual success glow banner */}
                <div className="absolute top-0 right-0 left-0 h-4 bg-emerald-400" />

                <div className="text-center pt-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-on-surface">
                    {isAr ? "تم التحقق والتفعيل بنجاح!" : "Pass Verified & Paid!"}
                  </h3>
                  <p className="text-emerald-500 text-xs font-black uppercase tracking-wider mt-1">
                    {isAr ? "التذكرة مدفوعة ونشطة الآن" : "Status: ACTIVE PAID"}
                  </p>
                </div>

                {/* Detailed Ticket Info Card */}
                <div className="bg-[#f0f1f1] rounded-[2rem] p-6 space-y-4 font-sans text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-on-surface/5">
                    <span className="text-on-surface/50 font-bold">{isAr ? "العميل" : "Customer"}</span>
                    <span className="font-extrabold text-on-surface">{scanResult.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-on-surface/5">
                    <span className="text-on-surface/50 font-bold">{isAr ? "فئة التذكرة" : "Pass Category"}</span>
                    <span className="font-extrabold text-secondary">{scanResult.ticketName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-on-surface/5">
                    <span className="text-on-surface/50 font-bold">{isAr ? "الكمية" : "Quantity"}</span>
                    <span className="font-extrabold text-on-surface">{scanResult.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-on-surface/50 font-bold">{isAr ? "قيمة النقدية المقبوضة" : "Cash Received"}</span>
                    <span className="text-xl font-black text-[#755700]">{scanResult.totalPrice} {isAr ? "جنيه" : "EGP"}</span>
                  </div>
                </div>

                {/* Local Arabic confirmation details */}
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs leading-relaxed text-right rtl">
                  {isAr 
                    ? "✓ تم ترحيل المبلغ المالي في سجلات الحسابات بوابة الدخول نقداً، وصارت التذكرة جاهزة للعبور فوراً."
                    : "✓ Payment has been successfully cataloged under Cash gate, and the ticket is now fully cleared for entry."}
                </div>

                <button
                  onClick={resetVerificationState}
                  className="w-full bg-secondary text-white py-4.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                >
                  {isAr ? "مسح تذكرة جديدة" : "Scan Another Pass"}
                </button>
              </motion.div>
            ) : scanError ? (
              <motion.div
                key="error"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white rounded-[3rem] p-8 shadow-ambient space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-4 bg-primary" />

                <div className="text-center pt-2">
                  <div className="w-16 h-16 rounded-full bg-[#fff0f1] text-primary flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-on-surface">
                    {isAr ? "عذراً، فشل التحقق" : "Verification Failed"}
                  </h3>
                  <p className="text-primary text-xs font-black uppercase tracking-wider mt-1">
                    {isAr ? "حدث خطأ أثناء فحص الطلب" : "Gate Entry Error"}
                  </p>
                </div>

                <div className="p-5 bg-[#fff0f1] text-primary rounded-2xl text-sm font-bold text-center leading-relaxed">
                  {scanError}
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={resetVerificationState}
                    className="w-full bg-[#f0f1f1] text-on-surface hover:bg-[#e4e5e5] py-4.5 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                  >
                    {isAr ? "إعادة المحاولة" : "Try Again"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#f0f1f1] rounded-[3rem] p-8 text-center py-16 space-y-4"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto text-on-surface/30 shadow-sm">
                  <DollarSign className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-extrabold text-on-surface/70">
                  {isAr ? "في انتظار مسح التذكرة" : "Awaiting Verification"}
                </h4>
                <p className="text-xs text-on-surface/40 max-w-[240px] mx-auto font-semibold leading-relaxed">
                  {isAr 
                    ? "عند مسح الرمز السريع أو إدخال البيانات المكتوبة، ستظهر تفاصيل الدفع والتحقق الفوري هنا."
                    : "Once a guest card is scanned or searched, payment details and cash confirmations will instantly populate here."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
