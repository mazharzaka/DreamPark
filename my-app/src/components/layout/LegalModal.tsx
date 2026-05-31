"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: "contact" | "privacy" | "terms" | null;
}

export function LegalModal({ isOpen, onClose, view }: LegalModalProps) {
  // We use standard hardcoded Arabic as requested by the user, 
  // but wrap in standard styling.
  
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1000);
  };

  const renderContent = () => {
    switch (view) {
      case "contact":
        return (
          <div className="flex flex-col md:flex-row gap-8" dir="rtl">
            {/* Info Grid */}
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-black text-secondary mb-6">اتصل بنا</h2>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">العنوان</h4>
                  <p className="text-on-surface/70 text-sm mt-1">مدينة السادس من أكتوبر، طريق الواحات، الجيزة.</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">رقم الهاتف</h4>
                  <p className="text-on-surface/70 text-sm mt-1">الخط الساخن الدعم الفني والاستفسارات.</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-ambient text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">البريد الإلكتروني</h4>
                  <p className="text-on-surface/70 text-sm mt-1">البريد الإلكتروني الرسمي لخدمة العملاء.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-surface-container-low p-6 rounded-xl shadow-ambient">
              <h3 className="text-xl font-bold mb-4">أرسل لنا رسالة</h3>
              {formStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-emerald space-y-3 py-12"
                >
                  <CheckCircle2 className="w-12 h-12" />
                  <p className="font-bold text-lg text-center">تم إرسال رسالتك بنجاح!<br/>سنتواصل معك قريباً.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">الاسم</label>
                    <input required type="text" className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all shadow-ambient" placeholder="الاسم الكامل" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
                    <input required type="email" className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all shadow-ambient" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">الرسالة</label>
                    <textarea required rows={4} className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all shadow-ambient" placeholder="كيف يمكننا مساعدتك؟" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formStatus === "submitting"}
                    className="w-full bg-gradient-to-r from-primary to-[#ff766d] text-white font-bold py-3 px-6 rounded-xl shadow-ambient flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {formStatus === "submitting" ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        إرسال <Send className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        );
      case "privacy":
        return (
          <div className="prose prose-lg max-w-none text-on-surface" dir="rtl">
            <h2 className="text-3xl font-black text-secondary mb-6">سياسة الخصوصية</h2>
            <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
              <section>
                <h3 className="text-xl font-bold text-primary mb-3">جمع البيانات</h3>
                <p className="text-on-surface/80 leading-relaxed">نحن لا نجمع بيانات شخصية لكون الموقع تعريفي، ونسعى دائماً للحفاظ على خصوصيتك أثناء تصفح الموقع وتجربة خدماتنا.</p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-primary mb-3">استخدام الكوكيز (Cookies)</h3>
                <p className="text-on-surface/80 leading-relaxed">قد نستخدم تقنيات الكوكيز البسيطة لتحسين تجربة التصفح وحفظ تفضيلات اللغة الخاصة بك فقط، دون تتبع أو مشاركة أي معلومات لجهات خارجية.</p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-primary mb-3">حماية معلومات الأطفال والزوار</h3>
                <p className="text-on-surface/80 leading-relaxed">نولي اهتماماً كبيراً بحماية معلومات الأطفال والزوار داخل الحديقة. كافة الإجراءات المتخذة تهدف لتوفير بيئة آمنة وسليمة لجميع ضيوفنا.</p>
              </section>
            </div>
          </div>
        );
      case "terms":
        return (
          <div className="prose prose-lg max-w-none text-on-surface" dir="rtl">
            <h2 className="text-3xl font-black text-secondary mb-6">شروط الخدمة</h2>
            <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
              <ul className="space-y-4 list-none p-0 m-0">
                <li className="flex gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-ambient">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">سياسة التذاكر</h3>
                    <p className="text-on-surface/80 text-sm">التذاكر صالحة لليوم المحجوز فقط وغير قابلة للاستبدال أو الاسترجاع.</p>
                  </div>
                </li>
                <li className="flex gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-ambient">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">قواعد السلامة</h3>
                    <p className="text-on-surface/80 text-sm">الالتزام التام بإرشادات الأمان لكل لعبة، بما في ذلك الحد الأدنى للطول والتعليمات الصحية.</p>
                  </div>
                </li>
                <li className="flex gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-ambient">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">السلوك العام</h3>
                    <p className="text-on-surface/80 text-sm">الحفاظ على نظافة المكان والالتزام بالذوق العام والمظهر اللائق داخل أروقة الحديقة لضمان متعة الجميع.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/20 glassmorphism z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 bottom-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto w-full md:w-[800px] max-h-[90vh] overflow-y-auto bg-surface rounded-t-3xl md:rounded-3xl shadow-ambient z-50 p-6 md:p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-lowest transition-colors shadow-ambient text-on-surface/70"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-8 md:mt-0">
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
