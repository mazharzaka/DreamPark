"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { useAppSelector } from "@/src/lib/hooks";
import { useLogoutServerMutation } from "@/src/lib/features/auth/authApi";
import { EditorialButton } from "../ui/EditorialButton";
import { motion } from "framer-motion";
import Image from "next/image";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export function Header() {
  const t = useTranslations("Navigation");
  const tActions = useTranslations("Actions");
  const locale = useLocale();
  const pathname = usePathname();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutServerMutation();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout().unwrap();
    router.push("/login");
  };

  const userRole = user?.role?.toUpperCase()?.trim();
  const normalizedUserRole = userRole === 'CUSTOMER' ? 'USER' :
                             userRole === 'STAFF' ? 'MARKETING_AGENT' :
                             userRole === 'ADMIN' ? 'ADMIN' : userRole;

  const navLinks = [
    {
      label: t("parkInfo"),
      href: "/park-info",
      active: pathname === "/park-info",
      visible: true,
    },
    {
      label: t("Games"),
      href: "/games",
      active: pathname === "/games",
      visible: true,
    },
    {
      label: t("tickets"),
      href: "/tickets",
      active: pathname === "/tickets",
      visible: true,
    },
    {
      label: locale === 'ar' ? 'الميدان' : 'Scanner',
      href: "/marketing-dashboard/scan",
      active: pathname === "/marketing-dashboard/scan",
      visible: isAuthenticated && (normalizedUserRole === 'MARKETING_AGENT' || normalizedUserRole === 'ADMIN'),
    },
    {
      label: locale === 'ar' ? 'المالية' : 'Finance',
      href: "/financial",
      active: pathname === "/financial",
      visible: isAuthenticated && (normalizedUserRole === 'FINANCIAL_MANAGER' || normalizedUserRole === 'ADMIN'),
    },
    {
      label: locale === 'ar' ? 'الأسعار' : 'Pricing',
      href: "/admin/pricing",
      active: pathname === "/admin/pricing",
      visible: isAuthenticated && normalizedUserRole === 'ADMIN',
    },
    {
      label: t("profile") || "Profile",
      href: "/profile",
      active: pathname === "/profile",
      visible: isAuthenticated,
    },
    {
      label: t("signup"),
      href: "/signup",
      active: pathname === "/signup",
      visible: !isAuthenticated,
    },
    {
      label: t("logout"),
      href: "#",
      active: false,
      visible: isAuthenticated,
      onClick: handleLogout,
    },
    {
      label: t("login"),
      href: "/login",
      active: pathname === "/login",
      visible: !isAuthenticated,
    },
  ];

  return (
    <header className="fixed left-1/2 -translate-x-1/2 z-50 w-full">
      <nav className="glassmorphism bg-white px-6 py-3 flex items-center justify-between shadow-ambient border border-white/20">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logoDream.png" alt="Logo" width={80} height={80} />
          <Link
            href="/"
            className="text-secondary text-xl md:block hidden pt-2 font-black italic tracking-tighter hover:opacity-80 transition-opacity"
          >
            <span className="text-primary"> Dream</span> Park
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks
            .filter((link) => link.visible)
            .map((link) => (
              <Link
                key={link.label}
                href={link.href as any}
                onClick={link.onClick}
                className={`relative text-sm font-bold tracking-wide transition-colors hover:text-primary ${
                  link.active ? "text-primary" : "text-on-surface/70"
                }`}
              >
                {link.label}
                {link.active && (
                  <motion.div
                    layoutId="header-active-link"
                    className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center flex-col  md:flex-row md:gap-3 gap-1">
          <EditorialButton
            variant="primary"
            link={`/${locale}/pass`}
            className="!px-3 !py-1 md:!px-6 md:!py-3 !min-h-0 !min-w-0  md:!text-xs !text-xxs"
          >
            {tActions("bookNow")}
          </EditorialButton>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
