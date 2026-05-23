"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/routing";
import { InputField } from "./InputField";
import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";
import { useSignUpWithPasswordMutation } from "../../../lib/features/auth/authApi";
import { useForm } from "react-hook-form";
import { OtpVerification } from "./OtpVerification";

export const SignupForm = () => {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [signUp] = useSignUpWithPasswordMutation();
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

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
      passwordConfirm: "",
      phone: "",
      gender: "male",
      dateOfBirth: "",
      address: "",
    },
  });

  const onSubmit = (data: any) => {
    signUp(data)
      .unwrap()
      .then((result) => {
        console.log("Signup successful:", result);
          setRegisteredEmail(data.email);
          setShowOtp(true);
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        const errMsg = typeof err?.data?.message === 'string'
          ? err.data.message
          : typeof err?.data?.error === 'string'
            ? err.data.error
            : typeof err?.error === 'string'
              ? err.error
              : "Registration failed. Please check your inputs.";

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

  if (showOtp) {
    return (
      <div className="w-full">
        <OtpVerification 
          email={registeredEmail} 
        />
      </div>
    );
  }

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
          errorKey={getErrorKey(errors.passwordConfirm?.message)}
          dir="ltr"
          {...register("passwordConfirm", {
            required: "errors.required",
            validate: (value) => {
              return value === watch("password") || "errors.passwordMismatch";
            },
          })}
        />

        <InputField
          type="tel"
          labelKey="Auth.fields.phoneNumber"
          placeholderKey="Auth.fields.phoneNumberPlaceholder"
          errorKey={getErrorKey(errors.phone?.message)}
          dir="ltr"
          {...register("phone", { required: "errors.required" })}
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
