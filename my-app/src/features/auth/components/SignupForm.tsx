"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/routing";
import { InputField } from "./InputField";
import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";
import { useDispatch } from "react-redux";
import { useSignUpMutation } from "../../../lib/features/auth/authApi";
import { setToken } from "../../../lib/features/auth/authSlice";
import { useForm } from "react-hook-form";

export const SignupForm = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const dispatch = useDispatch();
  const [signUp] = useSignUpMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phoneNumber: "",
      gender: "male",
      dateOfBirth: "",
      address: "",
    },
  });

  const onSubmit = (data: any) => {
    // Exclude password_confirmation from the payload sent to the API
    signUp(data)
      .unwrap()
      .then((result) => {
        if (result.success && result.token) {
          dispatch(setToken(result.token));
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        setError("root.serverError", {
          type: "manual",
          message:
            err?.data?.message ||
            err?.data?.error ||
            err?.error ||
            "Registration failed. Please check your inputs.",
        });
      });
  };

  const getErrorKey = (errorMsg: string | undefined) => {
    if (!errorMsg) return undefined;
    // If it's one of our predefined Auth keys, we prefix it, otherwise we leave it raw.
    // However, in InputField, it does t(errorKey) so passing a raw un-translated string
    // will just render that string if next-intl doesn't find it (which is good fallback).
    if (errorMsg.startsWith("errors.")) {
      return `Auth.${errorMsg}`;
    }
    return errorMsg; // e.g. "Passwords do not match"
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-cairo mb-3">
          {t("signup.title")}
        </h1>
        <p className="text-secondary/70">{t("signup.subtitle")}</p>
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
          labelKey="Auth.fields.fullName"
          placeholderKey="Auth.fields.fullNamePlaceholder"
          errorKey={getErrorKey(errors.name?.message)}
          {...register("name", { required: "errors.required" })}
        />

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
          {...register("password", {
            required: "errors.required",
            minLength: { value: 8, message: "errors.passwordLength" },
          })}
        />

        <PasswordInput
          labelKey="Auth.fields.confirmPassword"
          placeholderKey="Auth.fields.passwordPlaceholder"
          errorKey={getErrorKey(errors.password_confirmation?.message)}
          dir="ltr"
          {...register("password_confirmation", {
            required: "errors.required",
            validate: (value) => {
              console.log(value);
              console.log(value === watch("password"));
              return value === watch("password") || "errors.passwordMismatch";
            },
          })}
        />

        <InputField
          type="tel"
          labelKey="Auth.fields.phoneNumber"
          placeholderKey="Auth.fields.phoneNumberPlaceholder"
          errorKey={getErrorKey(errors.phoneNumber?.message)}
          dir="ltr"
          {...register("phoneNumber", { required: "errors.required" })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-secondary font-cairo">
            {t("fields.gender")}
          </label>
          <select
            className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
            {...register("gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <InputField
          type="date"
          labelKey="Auth.fields.dateOfBirth"
          placeholderKey="Auth.fields.dateOfBirthPlaceholder"
          errorKey={getErrorKey(errors.dateOfBirth?.message)}
          {...register("dateOfBirth", { required: "errors.required" })}
        />

        <InputField
          type="text"
          labelKey="Auth.fields.address"
          placeholderKey="Auth.fields.addressPlaceholder"
          errorKey={getErrorKey(errors.address?.message)}
          {...register("address", { required: "errors.required" })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "..." : t("signup.submit")}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center text-secondary/70 text-sm mt-8">
        {t("signup.hasAccount")}{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          {t("signup.signIn")}
        </Link>
      </p>
    </div>
  );
};
