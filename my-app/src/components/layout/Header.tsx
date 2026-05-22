"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
import { EditorialButton } from "../ui/EditorialButton";
import { motion } from "framer-motion";
import Image from "next/image";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export function Header() {
  const t = useTranslations("Navigation");
  const tActions = useTranslations("Actions");
  const locale = useLocale();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

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
      label: t("map"),
      href: "/map",
      active: pathname === "/map",
      visible: true,
    },
    // { label: t("contact"), href: "/contact", active: pathname === "/contact" },
    {
      label: token ? t("logout") : t("signup"),
      href: token ? "/logout" : "/signup",
      active: pathname === "/signup",
      visible: true,
    },
    {
      label: t("login"),
      href: "/login",
      active: pathname === "/login",
      visible: !token,
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
