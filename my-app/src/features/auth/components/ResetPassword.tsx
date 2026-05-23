"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { useSearchParams } from "next/navigation";
import { PasswordInput } from "./PasswordInput";
import { useForm } from "react-hook-form";
import { useResetPasswordWithOTPMutation } from "@/src/lib/features/auth/authApi";

export const ResetPassword = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [resetPassword] = useResetPasswordWithOTPMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  // If no token is present, we shouldn't allow them to reset
  if (!token) {
    return (
      <div className="w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          Invalid Session
        </h1>
        <p className="text-secondary/70">
          Your reset session is invalid or has expired. Please try again.
        </p>
        <button
          onClick={() => router.push("/forgot-password")}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold"
        >
          Back to Forgot Password
        </button>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    try {
      await resetPassword({
        resetToken: token,
        newPassword: data.password,
        newPasswordConfirm: data.passwordConfirm,
      }).unwrap();
      
      router.push("/login?reset=success");
    } catch (err: any) {
      console.error("Failed to reset password:", err);
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

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t("resetPassword.title") || "Reset Password"}
        </h1>
        <p className="text-secondary/70">
          {t("resetPassword.subtitle") || "Enter your new password below."}
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
        <PasswordInput
          labelKey="Auth.fields.password"
          placeholderKey="Auth.fields.passwordPlaceholder"
          errorKey={getErrorKey(errors.password?.message)}
          dir="ltr"
          {...register("password", {
            required: "errors.required",
            minLength: { value: 8, message: "errors.passwordLength" },
          })}
        />

        <PasswordInput
          labelKey="Auth.fields.confirmPassword"
          placeholderKey="Auth.fields.passwordPlaceholder"
          errorKey={getErrorKey(errors.passwordConfirm?.message)}
          dir="ltr"
          {...register("passwordConfirm", {
            required: "errors.required",
            validate: (value) => {
              return value === watch("password") || "errors.passwordMismatch";
            },
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "..." : t("resetPassword.submit") || "Reset Password"}
        </button>
      </form>
    </div>
  );
};
