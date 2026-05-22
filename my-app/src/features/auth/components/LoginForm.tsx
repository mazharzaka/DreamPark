"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/routing";
import { InputField } from "./InputField";
import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../../lib/features/auth/authApi";
import { setToken } from "../../../lib/features/auth/authSlice";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

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
          dispatch(setToken(result.token));
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Authentication failed:", err);
        setError("email", {
          type: "manual",
          message: "Authentication failed",
        });
      });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t("login.title")}
        </h1>
        <p className="text-secondary/70">{t("login.subtitle")}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mb-6"
        noValidate
      >
        <InputField
          type="email"
          labelKey="Auth.fields.email"
          placeholderKey="Auth.fields.emailPlaceholder"
          errorKey={errors.email?.message ? `Auth.${errors.email.message}` : (errors.email?.message === "Authentication failed" ? "Authentication failed" : undefined)}
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
          errorKey={errors.password?.message ? `Auth.${errors.password.message}` : undefined}
          dir="ltr"
          {...register("password", { required: "errors.required" })}
        />

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
