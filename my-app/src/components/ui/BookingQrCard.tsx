"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { format } from "date-fns";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Download, Calendar, X, Info, Check } from "lucide-react";

interface BookingQrCardProps {
  booking: {
    id: string;
    qrCodeId: string;
    ticketType?: {
      name: string;
      nameAr?: string;
      color?: string;
    };
    targetDate: string;
    status: string;
    quantity: number;
    totalPrice: number;
  };
  onChangeDate?: (id: string) => void;
  showChangeDateButton?: boolean;
  key?: string;
}

export const BookingQrCard = ({
  booking,
  onChangeDate,
  key,
  showChangeDateButton,
}: BookingQrCardProps) => {
  const t = useTranslations("booking");
  const locale = useLocale() || "en";
  const isRtl = locale === "ar";

  const passCardRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  React.useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        const canvas = document.querySelector(
          `#qr-modal-container-${booking.id} canvas`,
        ) as HTMLCanvasElement;
        if (canvas) {
          setQrDataUrl(canvas.toDataURL("image/png"));
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setQrDataUrl("");
    }
  }, [isModalOpen, booking.id, booking.qrCodeId]);

  const ticketName =
    locale === "ar" && booking.ticketType?.nameAr
      ? booking.ticketType.nameAr
      : booking.ticketType?.name || "Magic Pass";

  const isPaid = booking.status === "PAID";
  const isUsed = booking.status === "USED";
  const isCancelled = booking.status === "CANCELLED";
  const isPending = booking.status === "PENDING_PAYMENT";

  let statusColor = "bg-yellow-50 text-yellow-700";
  let statusText = t("status_pending_payment");

  if (isPaid) {
    statusColor = "bg-green-50 text-green-700";
    statusText = t("status_paid");
  } else if (isUsed) {
    statusColor = "bg-gray-100 text-gray-700";
    statusText = t("status_used");
  } else if (isCancelled) {
    statusColor = "bg-red-50 text-red-700";
    statusText = t("status_cancelled");
  } else if (booking.status === "EXPIRED") {
    statusColor = "bg-gray-100 text-gray-600";
    statusText = t("status_expired");
  }

  const dateObj = new Date(booking.targetDate);
  const isValidDate = !isNaN(dateObj.getTime());
  const formattedDate = isValidDate
    ? format(dateObj, "MMM dd, yyyy")
    : "Invalid Date";

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (passCardRef.current === null) return;

    try {
      setDownloadSuccess(true);

      const canvas = await html2canvas(passCardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
        onclone: (clonedDoc) => {
          const container = clonedDoc.getElementById(
            `capture-container-modal-${booking.id}`,
          );
          if (container) {
            container.style.position = "relative";
            container.style.left = "0";
            container.style.top = "0";
            container.style.zIndex = "auto";
          }
        },
      });

      const dataUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `DreamPark-Pass-${booking.id.substring(0, 8).toUpperCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error("Error generating pass image:", err);
      setDownloadSuccess(false);
    }
  };

  return (
    <>
      {/* Ticket Card Container (Tonal background shift, no border) */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-[28px] shadow-ambient hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10 overflow-hidden flex flex-col md:flex-row h-full cursor-pointer relative group"
        dir={isRtl ? "rtl" : "ltr"}
        key={key}
      >
        {/* Decorative Connected pass-cutout circles on boundaries */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-y-full ${isRtl ? "right-0 rounded-l-full" : "left-0 rounded-r-full"} z-10`}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-surface rounded-y-full ${isRtl ? "left-0 rounded-r-full" : "right-0 rounded-l-full"} z-10`}
        />

        {/* Left side / Top side: Info */}
        <div className="p-8 flex-1 flex flex-col justify-between relative z-20">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl md:text-2xl font-black font-cairo text-secondary leading-tight">
                {ticketName}
              </h3>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold ${statusColor}`}
              >
                {statusText}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm">
                <span className="w-24 text-on-surface/50 font-bold uppercase tracking-wider text-xs">
                  {isRtl ? "التاريخ:" : "Date:"}
                </span>
                <span className="font-semibold text-secondary">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24 text-on-surface/50 font-bold uppercase tracking-wider text-xs">
                  {isRtl ? "العدد:" : "Quantity:"}
                </span>
                <span className="font-semibold text-secondary">
                  {booking.quantity}x {t("qty") || "Tickets"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24 text-on-surface/50 font-bold uppercase tracking-wider text-xs">
                  {isRtl ? "القيمة:" : "Total:"}
                </span>
                <span className="font-bold text-primary">
                  {booking.totalPrice} {t("egp")}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24 text-on-surface/50 font-bold uppercase tracking-wider text-xs">
                  {isRtl ? "الرمز:" : "ID:"}
                </span>
                <span className="font-mono text-xs text-on-surface/60 font-semibold">
                  {booking.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* View QR Code primary trigger action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-[#ff766d] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-primary/10"
            >
              <QrCode size={14} />
              {isRtl ? "عرض كود QR" : "View QR Code"}
            </button>

            {/* Change Date secondary action */}
            {showChangeDateButton && onChangeDate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeDate(booking.id);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-outline-variant/20 text-secondary text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-outline-variant/10 shadow-sm"
              >
                <Calendar size={14} className="text-secondary" />
                {t("change_date")}
              </button>
            )}
          </div>
        </div>

        {/* Right side / Bottom side: Quick scannable preview layout */}
        <div className="bg-surface-container-low p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-outline-variant/10 min-w-[200px] relative z-20">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-outline-variant/10 mb-3 group-hover:scale-105 transition-transform duration-300">
            <QRCodeCanvas
              value={booking.qrCodeId || booking.id}
              size={110}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-[10px] font-bold font-mono text-on-surface/40 tracking-wider text-center uppercase">
            {isRtl ? "اضغط للتفاصيل" : "TAP FOR DETAILS"}
          </p>
        </div>
      </div>

      {/* Floating React Overlay Modal details using Framer Motion */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop overlay blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#2d2f2f]/60 backdrop-blur-sm"
            />

            {/* Modal Content container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-ambient relative z-10 border border-outline-variant/10 text-secondary"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} p-2 rounded-full bg-surface hover:bg-surface-container-low text-on-surface/40 hover:text-secondary transition-colors`}
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-secondary font-cairo mb-6 flex items-center gap-2">
                <QrCode className="text-primary w-6 h-6" />
                {t("modal_title")}
              </h3>

              {/* Premium Ticket/Pass Card */}
              <div className="relative w-full max-w-sm mx-auto">
                <div className="flex items-center absolute z-10 rounded-[2.5rem] opacity-10 w-full h-full bg-[url('/dream.png')] bg-cover bg-center bg-no-repeat" />

                <div
                  className="w-full rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden text-white mb-6"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.4) 100%), ${booking.ticketType?.color || "#005caa"}`,
                  }}
                >
                  {/* Security Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                    <span className="text-white/[0.03] font-black text-3xl whitespace-nowrap tracking-[0.2em] rotate-[-45deg] select-none uppercase">
                      DREAM PARK · دريم بارك
                    </span>
                  </div>

                  {/* Card Header (Logo aligned based on locale) */}
                  <div
                    className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 relative z-10`}
                  >
                    <div
                      className={`flex items-center gap-3.5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="bg-white/10 backdrop-blur-[10px] rounded-full p-2 flex items-center justify-center flex-shrink-0">
                        <img
                          src="/logoDream.png"
                          alt="Logo"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div
                        className={`flex flex-col leading-[1.1] ${isRtl ? "text-right" : "text-left"}`}
                      >
                        <span className="text-white font-black tracking-wider text-xs uppercase">
                          Dream Park
                        </span>
                        <span className="text-white/60 text-[9px] uppercase tracking-widest font-bold">
                          دريم بارك
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex ${isRtl ? "justify-end" : "justify-start"} sm:justify-end`}
                    >
                      <span className="bg-white/10 backdrop-blur-[10px] px-4.5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider text-white">
                        {statusText}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Name */}
                  <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight relative z-10">
                    {ticketName}
                  </h3>

                  {/* Metadata */}
                  <div className="flex justify-between items-center text-xs text-white/70 font-black mb-6 relative z-10">
                    <span>
                      {isRtl ? "العدد:" : "Qty:"} {booking.quantity}
                    </span>
                    <span>
                      {isRtl ? "التاريخ:" : "Date:"} {formattedDate}
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div
                    id={`qr-modal-container-${booking.id}`}
                    className="flex justify-center bg-white p-5 rounded-[2rem] shadow-md w-fit mx-auto mb-6 relative z-10"
                  >
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        width={160}
                        height={160}
                        className="w-[160px] h-[160px] object-contain"
                      />
                    ) : (
                      <QRCodeCanvas
                        value={booking.qrCodeId || booking.id}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                    )}
                  </div>

                  {/* Manual ID fallback */}
                  <div className="bg-black/10 backdrop-blur-[5px] p-4 rounded-2xl mb-4 text-center relative z-10">
                    <span className="block text-[10px] uppercase font-black text-white/40">
                      {t("manual_id") ||
                        (isRtl ? "الرمز التعريفي" : "Manual ID")}
                    </span>
                    <span className="font-mono text-xs md:text-sm font-black text-white/95 break-all block">
                      {booking.qrCodeId || booking.id}
                    </span>
                  </div>

                  {/* Price info (Separated with background shade) */}
                  <div className="bg-white/10 backdrop-blur-[10px] p-4 rounded-2xl flex justify-between items-center text-xs md:text-sm font-black text-white relative z-10">
                    <span className="text-white/75">
                      {isRtl ? "المبلغ المستحق:" : "Amount:"}
                    </span>
                    <span className="text-base md:text-lg font-black text-white">
                      {booking.totalPrice} {t("egp")}
                    </span>
                  </div>
                </div>
              </div>
              {/* Action buttons including canvas capture download offline fallback check */}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-surface hover:bg-surface-container-low text-on-surface/60 font-bold rounded-xl transition-colors border border-outline-variant/10 shadow-sm"
                >
                  {t("close")}
                </button>
                <button
                  onClick={handleDownload}
                  className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${downloadSuccess ? "bg-emerald-500 shadow-emerald-500/10" : "bg-gradient-to-r from-primary to-[#ff766d] shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]"}`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check size={16} />
                      {isRtl ? "تم الحفظ!" : "Saved!"}
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {t("save_to_device")}
                    </>
                  )}
                </button>
              </div>

              {isPending && (
                <div className="mt-6 p-4 bg-orange-50/50 rounded-2xl flex gap-2 border border-orange-100">
                  <Info className="text-orange-500 shrink-0 w-5 h-5 mt-0.5" />
                  <p className="text-xs text-orange-700 leading-relaxed">
                    {isRtl
                      ? "⚠️ يرجى العلم بأن الدفع يتم نقداً عند الوصول لمكتب التسويق بالمنتزه لتفعيل هذا الممر فوراً."
                      : "⚠️ Display this QR Code to the park marketing desk upon arrival to pay in cash and immediately activate your pass."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden static pass card container for html2canvas capture (no parent animations/transforms, standard width) */}
      <div
        id={`capture-container-modal-${booking.id}`}
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          width: "360px",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: -9999,
        }}
      >
        <div
          ref={passCardRef}
          className="w-full rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-white"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.4) 100%), ${booking.ticketType?.color || "#005caa"}`,
          }}
        >
          {/* Security Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span className="text-white/[0.03] font-black text-3xl whitespace-nowrap tracking-[0.2em] rotate-[-45deg] select-none uppercase">
              DREAM PARK · دريم بارك
            </span>
          </div>

          {/* Card Header (Standard side-by-side logo layout for captured image) */}
          <div
            className={`w-full flex items-center justify-between mb-6 relative z-10 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex items-center gap-3.5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="bg-white/10 backdrop-blur-[10px] rounded-full p-2 flex items-center justify-center flex-shrink-0">
                <img
                  src="/logoDream.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div
                className={`flex flex-col leading-[1.1] ${isRtl ? "text-right" : "text-left"}`}
              >
                <span className="text-white font-black tracking-wider text-xs uppercase">
                  Dream Park
                </span>
                <span className="text-white/60 text-[9px] uppercase tracking-widest font-bold">
                  دريم بارك
                </span>
              </div>
            </div>
            <span className="bg-white/10 backdrop-blur-[10px] px-4.5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider text-white">
              {statusText}
            </span>
          </div>

          {/* Ticket Name */}
          <h3 className="text-2xl font-black text-white mb-2 leading-tight relative z-10">
            {ticketName}
          </h3>

          {/* Metadata */}
          <div className="flex justify-between items-center text-xs text-white/70 font-black mb-6 relative z-10">
            <span>
              {isRtl ? "العدد:" : "Qty:"} {booking.quantity}
            </span>
            <span>
              {isRtl ? "التاريخ:" : "Date:"} {formattedDate}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="flex justify-center bg-white p-5 rounded-[2rem] shadow-md w-fit mx-auto mb-6 relative z-10">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                width={160}
                height={160}
                className="w-[160px] h-[160px] object-contain"
              />
            ) : (
              <QRCodeCanvas
                value={booking.qrCodeId || booking.id}
                size={160}
                level="H"
                includeMargin={false}
              />
            )}
          </div>

          {/* Manual ID fallback */}
          <div className="bg-black/10 backdrop-blur-[5px] p-4 rounded-2xl mb-4 text-center relative z-10">
            <span className="block text-[10px] uppercase font-black text-white/40">
              {t("manual_id") || (isRtl ? "الرمز التعريفي" : "Manual ID")}
            </span>
            <span className="font-mono text-xs md:text-sm font-black text-white/95 break-all block">
              {booking.qrCodeId || booking.id}
            </span>
          </div>

          {/* Price info (Separated with background shade) */}
          <div className="bg-white/10 backdrop-blur-[10px] p-4 rounded-2xl flex justify-between items-center text-xs md:text-sm font-black text-white relative z-10">
            <span className="text-white/75">
              {isRtl ? "المبلغ المستحق:" : "Amount:"}
            </span>
            <span className="text-base md:text-lg font-black text-white">
              {booking.totalPrice} {t("egp")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
