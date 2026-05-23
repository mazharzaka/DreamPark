"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  Crown,
  Users,
  Award,
  Ticket,
  Calendar,
  Phone,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Loader2,
  LogIn,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useGetTicketTypesQuery,
  useCreateBookingMutation,
} from "@/src/lib/features/api/bookingsApi";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/lib/hooks";
import {
  setStep,
  setSelectedCategory,
  setSelectedTicketId,
  setGeneratedPass,
  resetBookingFlow,
} from "@/src/lib/features/booking/bookingSlice";

type BookingFormData = {
  targetDate: string;
  quantity: number;
  phoneNumber: string;
};

type LoginFormData = {
  loginEmail: string;
  loginPassword: string;
};

// Lucide icon mapping helper
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Sparkles":
      return Sparkles;
    case "Crown":
      return Crown;
    case "Users":
      return Users;
    case "Award":
      return Award;
    default:
      return Ticket;
  }
};

export default function BookingFlow() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("booking");
  const params = useParams();

  // Extract optional ticket ID segment from params: e.g. [[...id]] catch-all segment
  const ticketIdFromUrl = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const dispatch = useAppDispatch();

  // Redux State
  const { step, selectedCategory, selectedTicketId, generatedPass } =
    useAppSelector((state) => state.booking);

  // React Hook Form for Booking
  const {
    register: registerBooking,
    handleSubmit: handleBookingSubmit,
    watch: watchBooking,
    setValue: setBookingValue,
  } = useForm<BookingFormData>({
    defaultValues: { targetDate: "", quantity: 1, phoneNumber: "" },
  });
  const targetDate = watchBooking("targetDate");
  const quantity = watchBooking("quantity");
  const phoneNumber = watchBooking("phoneNumber");

  // React Hook Form for Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
  } = useForm<LoginFormData>({
    defaultValues: { loginEmail: "", loginPassword: "" },
  });

  // Auth state local fallback
  const [token, setToken] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // RTK Queries
  const { data: ticketTypesRes, isLoading: isLoadingTickets } =
    useGetTicketTypesQuery();
  const [createBooking, { isLoading: isBookingLoading, error: bookingError }] =
    useCreateBookingMutation();

  const ticketTypes = ticketTypesRes?.data ?? [];
  const filteredTickets = ticketTypes.filter(
    (ticket) => ticket.category === selectedCategory,
  );

  // Sync token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Auto-activation logic for URL parameter
  useEffect(() => {
    if (ticketTypes.length > 0) {
      if (ticketIdFromUrl) {
        // Try to match the ticket by ID, database UUID, or a friendly URL slug
        const matchedTicket = ticketTypes.find(
          (t) =>
            t.id === ticketIdFromUrl ||
            t._id === ticketIdFromUrl ||
            t.name?.toLowerCase().replace(/\s+/g, "-") ===
              ticketIdFromUrl?.toLowerCase(),
        );
        if (matchedTicket) {
          dispatch(
            setSelectedTicketId(matchedTicket.id || matchedTicket._id || ""),
          );
          dispatch(setSelectedCategory(matchedTicket.category));
        } else {
          // Graceful fallback to first available ticket if invalid ID provided
          dispatch(setSelectedCategory(ticketTypes[0].category));
          dispatch(
            setSelectedTicketId(ticketTypes[0].id || ticketTypes[0]._id || ""),
          );
        }
      } else {
        // Default when no ID is provided: select first ticket of the first category
        const defaultCat = ticketTypes[0].category;
        dispatch(setSelectedCategory(defaultCat));
        const firstOfCat = ticketTypes.find((t) => t.category === defaultCat);
        if (firstOfCat) {
          dispatch(setSelectedTicketId(firstOfCat.id || firstOfCat._id || ""));
        }
      }
    }
  }, [ticketTypes, ticketIdFromUrl]);

  // Handle manual category switch
  const handleCategoryChange = (cat: "INDIVIDUAL" | "GROUP") => {
    dispatch(setSelectedCategory(cat));
    const firstOfCat = ticketTypes.find((ticket) => ticket.category === cat);
    if (firstOfCat) {
      dispatch(setSelectedTicketId(firstOfCat.id || firstOfCat._id || ""));
    }
  };

  const selectedTicket = ticketTypes.find(
    (t) => t.id === selectedTicketId || t._id === selectedTicketId,
  );

  // Securely calculate total price factoring in discounts
  const calculatePricing = () => {
    if (!selectedTicket) return { base: 0, discountAmt: 0, total: 0 };
    const base = selectedTicket.price;
    const discountAmt = base * ((selectedTicket.discount || 0) / 100);
    const finalPricePerUnit = base - discountAmt;
    return {
      base: base * quantity,
      discountAmt: discountAmt * quantity,
      total: finalPricePerUnit * quantity,
    };
  };

  const pricing = calculatePricing();

  // Date handlers
  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Handle checkout / JWT protection
  const onSubmitBooking: SubmitHandler<BookingFormData> = async (data) => {
    // data contains targetDate, quantity, phoneNumber but we also watch them

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedTicketId || !targetDate || !phoneNumber) {
      return;
    }

    try {
      const response = await createBooking({
        ticketTypeId: selectedTicketId,
        targetDate,
        quantity,
        phoneNumber,
      }).unwrap();

      if (response?.success) {
        dispatch(
          setGeneratedPass({
            bookingId: response.data.bookingId,
            qrCodeId: response.data.qrCodeId,
            targetDate,
            ticketName: selectedTicket?.name || "Single-Day Pass",
            ticketNameAr: selectedTicket?.nameAr || "تذكرة المرح",
            quantity,
            totalPrice: pricing.total,
            color: selectedTicket?.color || "#b5161e",
          }),
        );
        dispatch(dispatch(setStep(3))); // Success Screen
      }
    } catch (err) {
      console.log("Booking error:", err);
    }
  };

  // Inline login submit
  const onSubmitLogin: SubmitHandler<LoginFormData> = async (data) => {
    const { loginEmail, loginPassword } = data;
    if (!isLoggingIn) setIsLoggingIn(true);
    setLoginError(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setToken(data.token);
        setShowLoginModal(false);

        resetLogin();
      } else {
        setLoginError(
          data.message ||
            (isAr
              ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
              : "Invalid email or password"),
        );
      }
    } catch (err) {
      setLoginError(
        isAr ? "حدث خطأ أثناء الاتصال بالخادم" : "Error connecting to server",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getBookingErrorMessage = () => {
    if (!bookingError) return null;
    if ("data" in bookingError) {
      return (
        (bookingError as { data?: { error?: string } })?.data?.error ||
        (isAr
          ? "حدث خطأ أثناء إنشاء الحجز"
          : "An error occurred during booking")
      );
    }
    return isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred";
  };

  return (
    <div className="w-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* STEPS SEGMENTED CONTROLLER (No lines, strictly relies on background shades) */}
      {step < 3 && (
        <div className="max-w-xl mx-auto mb-10 bg-[#f0f1f1] p-1.5 rounded-full flex justify-between items-center relative shadow-inner">
          <button
            type="button"
            onClick={() => dispatch(setStep(1))}
            className={`flex-1 py-3 text-xs md:text-sm font-black uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
              step === 1
                ? "bg-white text-secondary shadow-md"
                : "text-on-surface/60 hover:text-on-surface"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
              1
            </span>
            {t("step_select")}
          </button>
          <button
            type="button"
            onClick={() => selectedTicketId && dispatch(setStep(2))}
            disabled={!selectedTicketId}
            className={`flex-1 py-3 text-xs md:text-sm font-black uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              step === 2
                ? "bg-white text-secondary shadow-md"
                : "text-on-surface/60 hover:text-on-surface"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
              2
            </span>
            {t("step_customize")}
          </button>
        </div>
      )}

      {/* STEP CONTENT SWITCHER */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* CATEGORY SWITCHER BUTTONS (No borders, only background layering) */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#f0f1f1] p-1.5 rounded-full flex gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("INDIVIDUAL")}
                  className={`px-8 py-3.5 rounded-full font-black text-sm transition-all duration-300 ${
                    selectedCategory === "INDIVIDUAL"
                      ? "bg-white text-secondary shadow-md"
                      : "text-on-surface/70 hover:text-on-surface"
                  }`}
                >
                  {t("individual_tabs")}
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryChange("GROUP")}
                  className={`px-8 py-3.5 rounded-full font-black text-sm transition-all duration-300 ${
                    selectedCategory === "GROUP"
                      ? "bg-white text-secondary shadow-md"
                      : "text-on-surface/70 hover:text-on-surface"
                  }`}
                >
                  {t("group_tabs")}
                </button>
              </div>
            </div>

            {/* TICKET TYPE CARDS */}
            {isLoadingTickets ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-96 bg-[#f0f1f1] rounded-[2.5rem] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTickets.map((ticket) => {
                  const IconComp = getIconComponent(ticket.icon || "");
                  const isSelected =
                    selectedTicketId === ticket.id ||
                    selectedTicketId === ticket._id;

                  return (
                    <motion.div
                      key={ticket.id || ticket._id}
                      onClick={() =>
                        dispatch(
                          setSelectedTicketId(ticket.id || ticket._id || ""),
                        )
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative overflow-hidden cursor-pointer rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 flex flex-col justify-between h-full bg-white shadow-md ${
                        isSelected
                          ? "ring-4 ring-secondary shadow-xl"
                          : "hover:shadow-lg"
                      }`}
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, #ffffff 0%, #fffcfc 100%)`
                          : "#ffffff",
                      }}
                    >
                      {/* Brand Pill Accent */}
                      <div
                        className="absolute top-0 right-0 left-0 h-4"
                        style={{ backgroundColor: ticket.color || "#b5161e" }}
                      />

                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-6">
                          <div
                            className="p-4 rounded-2xl text-white flex items-center justify-center shadow-lg"
                            style={{
                              backgroundColor: ticket.color || "#b5161e",
                            }}
                          >
                            <IconComp className="w-6 h-6" />
                          </div>

                          {/* Discount tag */}
                          {!!ticket.discount && ticket.discount > 0 && (
                            <span className="bg-[#fff0f1] text-[#b5161e] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider">
                              {isAr
                                ? `خصم ${ticket.discount}٪`
                                : `${ticket.discount}% OFF`}
                            </span>
                          )}
                        </div>

                        {/* Oversized, Bold Editorial Typography */}
                        <h3 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight mb-4">
                          {isAr ? ticket.nameAr : ticket.name}
                        </h3>

                        {/* Description bullet list */}
                        <ul className="space-y-3 mb-8">
                          {(
                            (isAr
                              ? ticket.descriptionAr
                              : ticket.description) || []
                          ).map((bullet: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-sm md:text-base text-on-surface/75 leading-relaxed"
                            >
                              <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing Section (Strictly NO border lines, separating with background shifting) */}
                      <div className="pt-6 mt-6 bg-[#f0f1f1]/50 p-6 rounded-3xl flex justify-between items-center">
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-on-surface/50 font-black">
                            {t("price")}
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            {!!ticket.discount && ticket.discount > 0 ? (
                              <>
                                <span className="text-3xl font-black text-[#b5161e] font-sans">
                                  {ticket.price * (1 - ticket.discount / 100)}{" "}
                                  {t("egp")}
                                </span>
                                <span className="text-sm line-through text-on-surface/40">
                                  {ticket.price} {t("egp")}
                                </span>
                              </>
                            ) : (
                              <span className="text-3xl font-black text-[#755700] font-sans">
                                {ticket.price} {t("egp")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tactile checkbox indicator */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-secondary text-white scale-110"
                              : "bg-[#f0f1f1] text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => dispatch(setStep(2))}
                disabled={!selectedTicketId}
                className="bg-secondary text-white rounded-full px-12 py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_30px_rgba(117,87,0,0.25)]"
              >
                {t("cta_next")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* INPUT FORM (Left 7 Cols) */}
            <form
              onSubmit={handleBookingSubmit(onSubmitBooking)}
              className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-md space-y-8"
            >
              {/* CURRENTLY CONFIGURING TICKET TACTILE CARD (Anti-Confusion Indicator) */}
              <div className="bg-[#f0f1f1]/70 p-6 rounded-3xl shadow-inner">
                <span className="block text-xs uppercase tracking-widest text-[#755700] font-black mb-1">
                  {t("currently_configuring")}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-secondary leading-tight mt-1">
                  {isAr ? selectedTicket?.nameAr : selectedTicket?.name}
                </h3>
                <span className="inline-block mt-3 text-xs font-black bg-white text-on-surface/70 px-4.5 py-2 rounded-full shadow-sm">
                  {t("category")}:{" "}
                  {selectedTicket?.category === "INDIVIDUAL"
                    ? t("individual")
                    : t("group")}
                </span>
              </div>

              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <Calendar className="w-7 h-7 text-secondary" />
                {t("choose_date")}
              </h2>

              {/* DATE PICKER & FAST BUTTONS */}
              <div className="space-y-4">
                <label className="block text-sm font-black text-on-surface/80">
                  {isAr
                    ? `اختر يوم زيارتك الساحر لـ ${selectedTicket?.nameAr}`
                    : `Select your magical visit date for ${selectedTicket?.name}`}
                </label>

                {/* Fast Selector Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setBookingValue("targetDate", getTodayDateString())
                    }
                    className={`py-4.5 rounded-2xl font-black text-sm transition-all ${
                      targetDate === getTodayDateString()
                        ? "bg-secondary text-white shadow-md"
                        : "bg-[#f0f1f1] text-on-surface hover:bg-[#e4e5e5]"
                    }`}
                  >
                    {isAr ? "اليوم" : "Today"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBookingValue("targetDate", getTomorrowDateString())
                    }
                    className={`py-4.5 rounded-2xl font-black text-sm transition-all ${
                      targetDate === getTomorrowDateString()
                        ? "bg-secondary text-white shadow-md"
                        : "bg-[#f0f1f1] text-on-surface hover:bg-[#e4e5e5]"
                    }`}
                  >
                    {isAr ? "غداً" : "Tomorrow"}
                  </button>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={getTodayDateString()}
                      {...registerBooking("targetDate", { required: true })}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <button
                      type="button"
                      className={`w-full py-4.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                        targetDate !== getTodayDateString() &&
                        targetDate !== getTomorrowDateString() &&
                        targetDate !== ""
                          ? "bg-secondary text-white shadow-md"
                          : "bg-[#f0f1f1] text-on-surface hover:bg-[#e4e5e5]"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      {targetDate &&
                      targetDate !== getTodayDateString() &&
                      targetDate !== getTomorrowDateString()
                        ? targetDate
                        : isAr
                          ? "تاريخ مخصص"
                          : "Custom"}
                    </button>
                  </div>
                </div>
              </div>

              {/* TACTILE QUANTITY ADJUSTER */}
              <div className="space-y-4">
                <label className="block text-sm font-black text-on-surface/80">
                  {isAr
                    ? `كم عدد تذاكر ${selectedTicket?.nameAr} التي ترغب بحجزها؟`
                    : `How many ${selectedTicket?.name} tickets would you like?`}
                </label>
                <div className="flex items-center gap-6 bg-[#f0f1f1] rounded-2xl p-2.5 w-fit shadow-inner">
                  <button
                    type="button"
                    onClick={() =>
                      setBookingValue("quantity", Math.max(1, quantity - 1))
                    }
                    className="w-12 h-12 rounded-xl bg-white shadow-sm text-secondary font-black text-2xl flex items-center justify-center hover:bg-white/80 active:scale-95 transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-black text-on-surface w-12 text-center font-sans">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookingValue("quantity", quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-secondary shadow-sm text-white font-black text-2xl flex items-center justify-center hover:bg-secondary/90 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PHONE NUMBER INPUT */}
              <div className="space-y-3">
                <label className="block text-sm font-black text-on-surface/80 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary" />
                  {isAr
                    ? `رقم الموبايل لتأكيد حجز ${selectedTicket?.nameAr} نقداً`
                    : `Mobile number to confirm ${selectedTicket?.name} in cash`}
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t("phone_placeholder")}
                  {...registerBooking("phoneNumber", { required: true })}
                  className="w-full bg-[#f0f1f1] border-none rounded-2xl p-5 text-on-surface font-sans text-base focus:ring-4 focus:ring-secondary/20 outline-none transition-all shadow-inner"
                />
              </div>

              {/* BUTTON ACTIONS (Strictly NO borders) */}
              <div className="flex gap-4 pt-6 mt-6 bg-[#f0f1f1]/30 p-6 rounded-3xl">
                <button
                  type="button"
                  onClick={() => dispatch(setStep(1))}
                  className="flex-1 py-5 rounded-full font-black text-sm uppercase tracking-wider text-on-surface bg-[#f0f1f1] hover:bg-[#e4e5e5] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("back")}
                </button>

                <button
                  type="submit"
                  disabled={isBookingLoading || !targetDate || !phoneNumber}
                  className="flex-[2] bg-[#b5161e] text-white rounded-full py-5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_30px_rgba(181,22,30,0.25)]"
                >
                  {isBookingLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t("cta_book")}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* CHECKOUT SUMMARY PANEL (Right 5 Cols - Glassmorphic design) */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-[20px] rounded-[2.5rem] p-8 shadow-md space-y-6">
              <h3 className="text-xl font-black text-on-surface">
                {t("booking_summary")}
              </h3>

              {selectedTicket && (
                <div className="space-y-4">
                  {/* Selected Ticket Mini Card */}
                  <div
                    className="p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: selectedTicket.color || "#b5161e",
                    }}
                  >
                    <span className="text-xs uppercase tracking-widest font-black text-white/70">
                      {t("selected_ticket")}
                    </span>
                    <h4 className="text-2xl font-black mt-1 font-sans leading-tight">
                      {isAr ? selectedTicket.nameAr : selectedTicket.name}
                    </h4>
                    <p className="text-sm opacity-90 mt-2 font-bold">
                      {quantity} x {selectedTicket.price} {t("egp")}
                    </p>
                  </div>

                  {/* Pricing Breakdown list */}
                  <div className="space-y-3.5 pt-4">
                    <div className="flex justify-between items-center text-sm text-on-surface/75">
                      <span>{t("base_price")}</span>
                      <span className="font-extrabold font-sans">
                        {pricing.base} {t("egp")}
                      </span>
                    </div>
                    {pricing.discountAmt > 0 && (
                      <div className="flex justify-between items-center text-sm text-[#b5161e] font-extrabold">
                        <span>{t("promo_discount")}</span>
                        <span className="font-sans">
                          -{pricing.discountAmt} {t("egp")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm text-on-surface/75">
                      <span>{t("target_date")}</span>
                      <span className="font-extrabold font-sans">
                        {targetDate || t("not_set")}
                      </span>
                    </div>

                    {/* Total Due Panel (No borderlines, strictly background shade) */}
                    <div className="pt-5 mt-5 bg-[#f0f1f1]/50 p-5 rounded-2xl flex justify-between items-end">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-on-surface/50 font-black">
                          {t("total_due")}
                        </span>
                        <span className="text-4xl font-black text-[#755700] font-sans">
                          {pricing.total}
                        </span>
                        <span className="text-sm text-on-surface/60 font-bold ml-1.5">
                          {t("egp")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="p-4.5 bg-[#f0f1f1]/70 rounded-2xl text-xs text-on-surface/70 leading-relaxed">
                    {t("cash_note")}
                  </div>

                  {getBookingErrorMessage() && (
                    <div className="p-4 bg-[#fff0f1] text-[#b5161e] rounded-2xl text-xs flex items-center gap-2 font-bold shadow-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{getBookingErrorMessage()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && generatedPass && (
          <motion.div
            key="step3"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            {/* SUCCESS BOARD / MAGIC PASS CARD */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden relative">
              {/* Header Colored Ribbon */}
              <div
                className="h-6 w-full"
                style={{ backgroundColor: generatedPass.color }}
              />

              <div className="p-8 md:p-12 text-center space-y-8">
                {/* Success Tick Badge */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-on-surface font-sans">
                    {t("pass_issued")}
                  </h2>
                  <p className="text-on-surface/60 text-sm md:text-base font-bold">
                    {t("pass_instructions")}
                  </p>
                </div>

                {/* PASS CARD GRAPHIC (No 1px borders, relying on deep ambient card shadows) */}
                <div className="max-w-sm mx-auto bg-gradient-to-br from-[#ffffff] to-[#f9f9f9] rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
                  {/* Card Ribbon */}
                  <div
                    className="absolute top-0 right-0 left-0 h-2.5"
                    style={{ backgroundColor: generatedPass.color }}
                  />

                  <div className="text-right rtl mb-4 mt-2">
                    <span className="bg-[#f0f1f1] px-4.5 py-2 rounded-full font-black text-xs uppercase tracking-wider text-on-surface/75">
                      {t("active_pass")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-on-surface mb-2 leading-tight">
                    {isAr
                      ? generatedPass.ticketNameAr
                      : generatedPass.ticketName}
                  </h3>

                  <div className="flex justify-between items-center text-xs text-on-surface/50 font-black mb-6">
                    <span>
                      {t("qty")}: {generatedPass.quantity}
                    </span>
                    <span>
                      {t("visit")}: {generatedPass.targetDate}
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex justify-center bg-white p-6 rounded-[2rem] shadow-md w-fit mx-auto mb-6">
                    <QRCodeSVG
                      value={generatedPass.qrCodeId}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Alphanumeric ID fallback */}
                  <div className="bg-[#f0f1f1] p-4 rounded-2xl mb-4 text-center">
                    <span className="block text-[10px] uppercase font-black text-on-surface/40">
                      {t("manual_id")}
                    </span>
                    <span className="font-mono text-sm font-black text-on-surface/90">
                      {generatedPass.qrCodeId}
                    </span>
                  </div>

                  {/* Price info (Separated with background shade) */}
                  <div className="bg-[#f0f1f1]/50 p-4 rounded-2xl flex justify-between items-center text-sm font-black text-on-surface/85">
                    <span>{t("due_cash")}</span>
                    <span className="text-xl font-black text-secondary">
                      {generatedPass.totalPrice} {t("egp")}
                    </span>
                  </div>
                </div>

                {/* User localized Arabic instructions */}
                {isAr && (
                  <div className="bg-[#f0f1f1] p-6 rounded-3xl text-sm text-on-surface/80 leading-relaxed text-right rtl space-y-2">
                    <h4 className="font-extrabold text-secondary text-base mb-2">
                      💡 خطوات إتمام زيارتك:
                    </h4>
                    <p className="flex gap-2">
                      <span className="text-primary font-bold">١.</span>
                      <span>
                        توجه مباشرة لمكتب التسويق بمدخل الحديقة يوم الزيارة{" "}
                        <b>({generatedPass.targetDate})</b>.
                      </span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-primary font-bold">٢.</span>
                      <span>أظهر رمز الـ QR الموضح أعلاه لموظف البوابة.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-primary font-bold">٣.</span>
                      <span>
                        ادفع قيمة التذكرة نقداً{" "}
                        <b>({generatedPass.totalPrice} جنيه)</b> لتفعيل ممرك
                        ودخول المنتزه فوراً!
                      </span>
                    </p>
                  </div>
                )}

                <div className="pt-2 flex flex-col md:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setStep(1));
                      dispatch(setGeneratedPass(null));
                      setBookingValue("phoneNumber", "");
                      setBookingValue("targetDate", "");
                      setBookingValue("quantity", 1);
                    }}
                    className="flex-1 py-4.5 rounded-full font-black text-xs uppercase tracking-widest bg-[#f0f1f1] text-on-surface hover:bg-[#e4e5e5] transition-all"
                  >
                    {t("book_another")}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-4.5 rounded-full font-black text-xs uppercase tracking-widest bg-secondary text-white hover:bg-secondary/95 transition-all shadow-[0_10px_20px_rgba(117,87,0,0.2)]"
                  >
                    {t("print_save")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JWT INLINE LOGIN MODAL (No borderlines, glassmorphic with elegant overlay) */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-[#2d2f2f]/40 backdrop-blur-[6px]"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-on-surface">
                  {t("login_required")}
                </h3>
                <p className="text-sm text-on-surface/60 mt-1">
                  {t("login_subtitle")}
                </p>
              </div>

              {loginError && (
                <div className="p-4 bg-[#fff0f1] text-[#b5161e] rounded-2xl text-xs flex items-center gap-2 font-bold shadow-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form
                onSubmit={handleLoginSubmit(onSubmitLogin)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface/50 uppercase tracking-wider block">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    required
                    {...registerLogin("loginEmail", { required: true })}
                    placeholder="e.g. test@example.com"
                    className="w-full bg-[#f0f1f1] border-none rounded-xl p-4 text-on-surface font-sans text-sm focus:ring-4 focus:ring-secondary/15 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-on-surface/50 uppercase tracking-wider block">
                    {t("password")}
                  </label>
                  <input
                    type="password"
                    required
                    {...registerLogin("loginPassword", { required: true })}
                    placeholder="••••••••"
                    className="w-full bg-[#f0f1f1] border-none rounded-xl p-4 text-on-surface font-sans text-sm focus:ring-4 focus:ring-secondary/15 outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Login Button (Strictly NO borders) */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-secondary text-white py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      {t("sign_in")}
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-4 mt-4 bg-[#f0f1f1]/30 p-3 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs font-black text-on-surface/40 hover:text-on-surface/80"
                >
                  {t("cancel_close")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
