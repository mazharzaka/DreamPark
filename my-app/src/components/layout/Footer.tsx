"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { motion } from "framer-motion";
import { useState } from "react";
import { LegalModal } from "./LegalModal";
import { MapPin, Phone, Mail } from "lucide-react";

const Facebook = (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>;
const Twitter = (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
const Instagram = (props: any) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const Youtube = (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

export function Footer() {
  const [modalView, setModalView] = useState<"contact" | "privacy" | "terms" | null>(null);
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");

  const quickLinks = [
    { name: nav("home"), href: "/" },
    { name: nav("parkInfo"), href: "/info" },
    { name: nav("Games"), href: "/games" },
    { name: nav("Zoo"), href: "/zoo" },
    { name: nav("tickets"), href: "/tickets" },
  ];

  const supportLinks = [
    { name: t("faq"), href: "/info" },
    { name: t("contact"), action: () => setModalView("contact") },
    { name: t("privacy"), action: () => setModalView("privacy") },
    { name: t("terms"), action: () => setModalView("terms") },
  ];

  const socials = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Youtube, href: "#", name: "Youtube" },
  ];

  return (
    <footer className="w-full bg-surface-container-low text-on-surface pt-16 pb-8 px-6 lg:px-16 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Description */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black tracking-tight text-secondary">
                Dream<span className="text-primary">Park</span>
              </span>
            </Link>
            <p className="text-on-surface/70 leading-relaxed text-sm md:text-base">
              {t("description")}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-secondary shadow-ambient hover:bg-secondary hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold">{t("quickLinks")}</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href as any}
                    className="text-on-surface/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold">{t("support")}</h3>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  {link.href ? (
                    <Link
                      href={link.href as any}
                      className="text-on-surface/70 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-secondary rounded-full transition-all duration-300 group-hover:w-4"></span>
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={link.action}
                      className="text-on-surface/70 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="w-0 h-0.5 bg-secondary rounded-full transition-all duration-300 group-hover:w-4"></span>
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold">{t("contact")}</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-on-surface/70">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm mt-1">123 Dream Oasis Blvd, Amusement City, CA 90210</span>
              </li>
              <li className="flex items-start gap-3 text-on-surface/70">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-secondary">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm mt-1" dir="ltr">+1 (800) 123-DREAM</span>
              </li>
              <li className="flex items-start gap-3 text-on-surface/70">
                <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm mt-1">hello@dreampark.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/10 text-sm text-on-surface/50">
          <p>{t("rights")}</p>
          <div className="flex gap-6">
            <button onClick={() => setModalView("privacy")} className="hover:text-primary transition-colors cursor-pointer">{t("privacy")}</button>
            <button onClick={() => setModalView("terms")} className="hover:text-primary transition-colors cursor-pointer">{t("terms")}</button>
          </div>
        </div>
      </div>
      
      <LegalModal 
        isOpen={modalView !== null} 
        onClose={() => setModalView(null)} 
        view={modalView} 
      />
    </footer>
  );
}
