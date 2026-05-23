"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COLORS = [
  "rgba(181,22,30,0.7)",   // primary red
  "rgba(0,92,170,0.7)",    // secondary blue
  "rgba(255,200,40,0.6)",  // gold accent
  "rgba(255,255,255,0.4)", // white shimmer
];

const TAGLINE_EN = "Where Every Moment Becomes Magic";
const TAGLINE_AR = "حيث تصبح كل لحظة سحراً";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ParticleField({ particles }: { particles: Particle[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}

function LogoMark() {
  const ringControls = useAnimation();

  useEffect(() => {
    ringControls.start({
      rotate: 360,
      transition: { duration: 8, repeat: Infinity, ease: "linear" },
    });
  }, [ringControls]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Outer rotating dashed ring */}
      <motion.div
        animate={ringControls}
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px dashed rgba(181,22,30,0.4)",
        }}
      />
      {/* Middle pulsing ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: "1px solid rgba(0,92,170,0.3)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Glowing backdrop */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          background:
            "radial-gradient(circle, rgba(181,22,30,0.25) 0%, rgba(0,92,170,0.15) 60%, transparent 100%)",
          filter: "blur(8px)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Logo circle */}
      <motion.div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: 80,
          height: 80,
          background:
            "linear-gradient(135deg, #b5161e 0%, #8b1015 50%, #005caa 100%)",
          boxShadow:
            "0 0 40px rgba(181,22,30,0.5), 0 0 80px rgba(0,92,170,0.2), inset 0 1px 1px rgba(255,255,255,0.2)",
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* DP Monogram */}
        <span
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: "#fff",
            letterSpacing: "-1px",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          DP
        </span>
      </motion.div>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative w-64 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
      {/* Track glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "rgba(181,22,30,0.2)", filter: "blur(4px)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #b5161e, #005caa, #b5161e)",
          backgroundSize: "200% 100%",
          width: `${progress}%`,
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Leading dot */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{
          left: `${Math.max(0, progress - 1)}%`,
          background: "#fff",
          boxShadow: "0 0 8px #fff, 0 0 16px rgba(181,22,30,0.8)",
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SplashScreenProps {
  /** Duration in ms before the splash auto-dismisses. Default: 3000 */
  duration?: number;
  /** Called when splash exit animation completes */
  onFinished?: () => void;
  /** Current locale for bilingual tagline */
  locale?: string;
}

export default function SplashScreen({
  duration = 3000,
  onFinished,
  locale = "en",
}: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles] = useState(() => generateParticles(40));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAr = locale === "ar";
  const tagline = isAr ? TAGLINE_AR : TAGLINE_EN;

  // Drive the progress bar
  useEffect(() => {
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setTimeout(() => setVisible(false), 300);
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const taglineChars = tagline.split("");

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(181,22,30,0.15) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 70% 80%, rgba(0,92,170,0.12) 0%, transparent 50%), " +
              "#0a0b0d",
          }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] },
          }}
        >
          <ScanlineOverlay />
          <ParticleField particles={particles} />

          {/* Top-right corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(181,22,30,0.12), transparent 70%)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          {/* Bottom-left corner accent */}
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at bottom left, rgba(0,92,170,0.1), transparent 70%)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />

          {/* Content stack */}
          <div
            className="relative z-10 flex flex-col items-center gap-8"
            dir={isAr ? "rtl" : "ltr"}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <LogoMark />
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <h1
                style={{
                  fontFamily: isAr
                    ? "var(--font-cairo), sans-serif"
                    : "var(--font-plus-jakarta-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: isAr ? "2.6rem" : "2.8rem",
                  letterSpacing: isAr ? "0" : "-0.03em",
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {isAr ? "دريم بارك" : "DreamPark"}
              </h1>
              {/* Animated underline */}
              <motion.div
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, #b5161e, #005caa)",
                  borderRadius: 2,
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              />
            </motion.div>

            {/* Animated tagline – character by character */}
            <div
              className="flex flex-wrap justify-center gap-x-[0.5px]"
              style={{ maxWidth: 320 }}
            >
              {taglineChars.map((char, i) => (
                <motion.span
                  key={i}
                  style={{
                    fontFamily: isAr
                      ? "var(--font-ibm-plex-arabic), sans-serif"
                      : "var(--font-plus-jakarta-sans), sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.5)",
                    whiteSpace: char === " " ? "pre" : "normal",
                    letterSpacing: isAr ? "0.02em" : "0.08em",
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.1 + i * 0.03,
                    ease: "easeOut",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Progress section */}
            <motion.div
              className="flex flex-col items-center gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <ProgressBar progress={progress} />
              <motion.span
                style={{
                  fontFamily: "var(--font-plus-jakarta-sans), monospace",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isAr ? "جاري التحميل..." : "Loading..."}
              </motion.span>
            </motion.div>
          </div>

          {/* Bottom branding strip */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <span
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              © {new Date().getFullYear()} DreamPark. All rights reserved.
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
