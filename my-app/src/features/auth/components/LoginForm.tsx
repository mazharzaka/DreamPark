"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/routing";
import { InputField } from "./InputField";
import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";
import { useDispatch } from "react-redux";
import { useLoginWithPasswordMutation } from "../../../lib/features/auth/authApi";
import { setCredentials } from "../../../lib/features/auth/authSlice";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginWithPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    login(data)
      .unwrap()
      .then((result) => {
        if (result.success && result.token) {
          dispatch(setCredentials({ token: result.token, user: result.data.user }));
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Authentication failed:", err);
        const errMsg = typeof err?.data?.message === 'string'
          ? err.data.message
          : typeof err?.data?.error === 'string'
            ? err.data.error
            : typeof err?.error === 'string'
              ? err.error
              : "Authentication failed";

        setError("root.serverError", {
          type: "manual",
          message: errMsg,
        });
      });
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
          {t("login.title")}
        </h1>
        <p className="text-secondary/70">{t("login.subtitle")}</p>
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

        <PasswordInput
          labelKey="Auth.fields.password"
          placeholderKey="Auth.fields.passwordPlaceholder"
          errorKey={getErrorKey(errors.password?.message)}
          dir="ltr"
          {...register("password", { required: "errors.required" })}
        />
        
        <div className="flex justify-end mt-[-10px]">
          <Link href="/forgot-password" className="text-sm font-semibold text-tertiary hover:underline">
            {t("login.forgotPassword") || "Forgot Password?"}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "..." : t("login.submit")}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center text-secondary/70 text-sm mt-8">
        {t("login.noAccount")}{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          {t("login.createAccount")}
        </Link>
      </p>
    </div>
  );
};
