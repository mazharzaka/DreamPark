"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useVerifyAndConfirmPaymentMutation } from "@/src/lib/features/api/bookingsApi";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AgentScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    details?: any;
  } | null>(null);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const [verifyAndConfirmPayment, { isLoading }] = useVerifyAndConfirmPaymentMutation();

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerRef.current.render(onScanSuccess, () => { });

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanResult === decodedText) return;
    setScanResult(decodedText);
    scannerRef.current?.pause(true);

    try {
      const res = await verifyAndConfirmPayment({ qrCodeId: decodedText }).unwrap();
      setFeedback({ type: "success", message: "تم تأكيد الدفع بنجاح", details: res.data });
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.data?.error?.message || (typeof err?.data?.error === 'string' ? err?.data?.error : null) || "حدث خطأ";
      setFeedback({ type: "error", message: errMsg });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setFeedback(null);
    scannerRef.current?.resume();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col mt-22 items-center justify-center p-6 rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-[0_40px_100px_rgba(45,47,47,0.06)] backdrop-blur-[20px]"
      >
        <h1 className="text-[#005caa] text-3xl font-extrabold mb-8 text-center font-['Plus_Jakarta_Sans']">
          مركز التحقق والتأكيد
        </h1>

        <div className="relative overflow-hidden rounded-[2rem] shadow-inner bg-[#f6f6f6] mb-8">
          <div id="qr-reader" className="w-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-12 h-12 text-[#005caa] animate-spin" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className={`rounded-2xl p-6 ${feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
                  : "bg-[#fff0f1] text-[#b5161e] shadow-[0_10px_30px_rgba(181,22,30,0.1)]"
                }`}
            >
              <div className="flex items-center mb-4">
                {feedback.type === "success" ? (
                  <CheckCircle className="w-8 h-8 mr-3 text-emerald-600" />
                ) : (
                  <XCircle className="w-8 h-8 mr-3 text-[#b5161e]" />
                )}
                <h2 className="text-xl font-bold">{feedback.message}</h2>
              </div>

              {feedback.type === "success" && feedback.details && (
                <div className="space-y-3 bg-white/60 p-4 rounded-xl mt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold opacity-75">رقم الحجز:</span>
                    <span className="font-bold">{String(feedback.details.bookingId).slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold opacity-75">نوع التذكرة:</span>
                    <span className="font-bold">{feedback.details.ticketName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold opacity-75">الكمية:</span>
                    <span className="font-bold">{feedback.details.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-emerald-100 mt-2">
                    <span className="font-semibold opacity-75">المبلغ المطلوب تحصيله:</span>
                    <span className="text-2xl font-extrabold text-[#755700]">
                      {feedback.details.totalPrice} جنيه
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={resetScanner}
                className={`mt-6 w-full py-3 rounded-full font-bold transition-all ${feedback.type === "success"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-[#b5161e] text-white hover:bg-[#9a1219]"
                  }`}
              >
                مسح تذكرة أخرى
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
