"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/src/i18n/routing";
import { useAppSelector } from "@/src/lib/hooks";
import { useLogoutServerMutation } from "@/src/lib/features/auth/authApi";
import { EditorialButton } from "../ui/EditorialButton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { Menu, X } from "lucide-react";

export function Header() {
  const t = useTranslations("Navigation");
  const tActions = useTranslations("Actions");
  const locale = useLocale();
  const pathname = usePathname();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutServerMutation();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const isRTL = locale === "ar";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  // Animation Variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring" as const, stiffness: 350, damping: 35 },
    },
    closed: {
      x: isRTL ? "-100%" : "100%",
      transition: { type: "spring" as const, stiffness: 350, damping: 35 },
    },
  };

  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.15 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const linkVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
    closed: {
      x: isRTL ? -20 : 20,
      opacity: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <header className="fixed left-1/2 -translate-x-1/2 z-50 w-full px-4 md:px-0">
        <nav className="glassmorphism bg-white/95 px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-between shadow-ambient border border-white/20 max-w-7xl mx-auto rounded-2xl mt-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/logoDream.png" 
              alt="Logo" 
              width={50} 
              height={50} 
              className="md:w-16 md:h-16 object-contain"
            />
            <Link
              href="/"
              className="text-secondary text-lg md:text-xl pt-1 font-black italic tracking-tighter hover:opacity-80 transition-opacity flex items-center"
            >
              <span className="text-primary">Dream</span>
              <span className="md:inline hidden ml-1">Park</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
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

          {/* CTA & Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <EditorialButton
              variant="primary"
              link={`/${locale}/pass`}
              className="!px-3 !py-1.5 md:!px-6 md:!py-3 !min-h-0 !min-w-0 text-xs md:text-sm font-black"
            >
              {tActions("bookNow")}
            </EditorialButton>

            {/* Language Switcher (Desktop) */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer rounded-full hover:bg-black/5"
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Side Navigation Drawer */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed top-0 bottom-0 z-50 w-[280px] sm:w-[320px] h-screen bg-white/95 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between ${
                isRTL ? "left-0 border-r border-black/10" : "right-0 border-l border-black/10"
              }`}
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <Image src="/logoDream.png" alt="Logo" width={40} height={40} />
                    <span className="text-secondary text-lg font-black italic tracking-tighter">
                      <span className="text-primary">Dream</span> Park
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer rounded-full hover:bg-black/5"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer Links */}
                <motion.div
                  variants={containerVariants}
                  className="flex flex-col gap-2 mt-6"
                >
                  {navLinks
                    .filter((link) => link.visible)
                    .map((link) => (
                      <motion.div key={link.label} variants={linkVariants}>
                        <Link
                          href={link.href as any}
                          onClick={(e) => {
                            if (link.onClick) {
                              link.onClick(e);
                            }
                            setIsOpen(false);
                          }}
                          className={`block py-3 px-4 rounded-xl text-base font-bold transition-all ${
                            link.active
                              ? "bg-primary/10 text-primary"
                              : "text-on-surface/85 hover:bg-black/5 hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                </motion.div>
              </div>

              {/* Drawer Footer (Language Switcher) */}
              <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface/70">
                  {isRTL ? "العربية" : "English"}
                </span>
                <LanguageSwitcher />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
