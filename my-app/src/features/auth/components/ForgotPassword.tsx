"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/routing";
import { InputField } from "./InputField";
import { useForm } from "react-hook-form";
import { useSendOtpMutation } from "@/src/lib/features/auth/authApi";
import { OtpVerification } from "./OtpVerification";

export const ForgotPassword = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [sendOtp] = useSendOtpMutation();
  const [showOtp, setShowOtp] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await sendOtp({ email: data.email, purpose: "password_reset" }).unwrap();
      setRequestedEmail(data.email);
      setShowOtp(true);
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      const errMsg =
        typeof err?.data?.message === "string"
          ? err.data.message
          : typeof err?.data?.error === "string"
          ? err.data.error
          : typeof err?.error === "string"
          ? err.error
          : "Failed to process request";

      setError("root.serverError", {
        type: "manual",
        message: errMsg,
      });
    }
  };

  const getErrorKey = (errorMsg: string | undefined) => {
    if (!errorMsg) return undefined;
    if (errorMsg.startsWith("errors.")) {
      return `Auth.${errorMsg}`;
    }
    return errorMsg;
  };

  if (showOtp) {
    // For password reset, OtpVerification needs to handle the redirect differently
    // Actually, we can reuse it if we modify it to accept a custom purpose and onSuccess callback.
    // I will use it with purpose="password_reset".
    return (
      <div className="w-full">
        <OtpVerification
          email={requestedEmail}
          purpose="password_reset"
          onSuccess={(data) => {
            if (data?.resetToken) {
              router.push(`/reset-password?token=${data.resetToken}`);
            } else {
              router.push("/login");
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t("forgotPassword.title") || "Forgot Password"}
        </h1>
        <p className="text-secondary/70">
          {t("forgotPassword.subtitle") || "Enter your email to receive a reset code."}
        </p>
      </div>

      {errors.root?.serverError?.message && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errors.root.serverError.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mb-6"
        noValidate
      >
        <InputField
          type="email"
          labelKey="Auth.fields.email"
          placeholderKey="Auth.fields.emailPlaceholder"
          errorKey={getErrorKey(errors.email?.message)}
          dir="ltr"
          {...register("email", {
            required: "errors.required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "errors.emailInvalid",
            },
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "..." : t("forgotPassword.submit") || "Send Reset Code"}
        </button>
      </form>

      <p className="text-center text-secondary/70 text-sm mt-8">
        {t("forgotPassword.remembered") || "Remember your password?"}{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          {t("signup.signIn")}
        </Link>
      </p>
    </div>
  );
};
